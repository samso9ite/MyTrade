import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';

declare var $;

@Component({
  selector: 'app-gift-card',
  templateUrl: './gift-card.component.html',
  styleUrls: ['./gift-card.component.scss']
})
export class GiftCardComponent implements OnInit, AfterContentChecked {
  valueFromHeader;
  cardName: string;
  cardId: string;

  loading = false;
  submitted = false;
  submitting = false;
  card = {
    image: '',
    rates: []
  };
  cardTypes = [];
  countries = [];
  rawCountries = [];

  cardForm: FormGroup;
  ratesForm: FormGroup;
  notFound;
  disabledMessage = null;
  currentRates = [];
  computedRate = 0;
  uploadedImages = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private toastrService: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.loading = true;
    this.notFound = false;

    this.cardName = this.activatedRoute.snapshot.params.name;
    this.cardId = this.activatedRoute.snapshot.params.id;

    this.findCountries();

    this.dataService.getCardDetails(this.cardId).subscribe(
      (res: any) => {
        if (res.status) {
          this.loading = false;
          this.card = res.data;

          this.card.rates.forEach(rate => {
            const currency = this.findCountryCurrency(rate.country);

            if (!this.cardTypes.includes(rate.cardType)) {
              this.cardTypes.push(rate.cardType);
            }

            rate.currency = currency;
            this.countries.push({ country: rate.country, currency });
          });

          this.countries = this.getDistinctCountries(this.countries);
        }
      },
      err => {
        this.loading = false;
        this.toastrService.error('An error occured while fetching card details');
        console.error(err);
      }
    );
  }

  ngOnInit(): void {
    this.cardForm = this.formBuilder.group({
      card_type: ['', Validators.required],
      card_digits: [''],
      card_value: ['', Validators.required],
      country: ['', Validators.required],
      card_receipt_image: [''],
      amount: ['', Validators.required]
    });

    this.ratesForm = this.formBuilder.group({
      rate: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  get f(): any {
    return this.cardForm.controls;
  }

  get r(): any {
    return this.ratesForm.controls;
  }

  findCountries(): void {
    this.loading = true;

    this.dataService.getCountries().subscribe(
      (response: any) => {
        this.rawCountries = response;
        this.loading = false;
      },
      err => {
        this.loading = false;
        this.toastrService.error('An error occurred while fetching countries');
        console.error(err);
      }
    );
  }

  findCountryCurrency(country: string): string {
    if (!this.rawCountries.length) {
      this.findCountries();
    }

    console.log(this.rawCountries);

    const countryCurrency = this.rawCountries.find(c => c.name === country);
    return countryCurrency.currency;
  }

  getDistinctCountries(
    array: Array<{ country: string; currency: string }>
  ): Array<{ country: string; currency: string }> {
    const unique = array.filter(
      (thing, index, self) =>
        index === self.findIndex(t => t.country === thing.country && t.currency === thing.currency)
    );

    return unique;
  }

  onUploadCardFinished(event: any): void {
    this.uploadedImages.push(event.serverResponse.response.body.data.link);
  }

  onRemoveCardImage(event: any): void {
    const removedImage = event.serverResponse.response.body.data.link;
    const removedIndex = this.uploadedImages.indexOf(removedImage);

    if (removedIndex !== -1) {
      this.uploadedImages.splice(removedIndex, 1);
    }
  }

  between(x, range): boolean {
    const [min, max] = range.split('-');
    return x >= min && x <= max;
  }

  isRateAvailable(amount: number): boolean {
    let isAvailable = false;
    this.currentRates.forEach(rate => {
      const isBetween = this.between(amount, rate.denomination);

      if (isBetween) {
        isAvailable = true;
        this.computedRate = rate.rate;

        if (rate.isDisabled) {
          this.disabledMessage = rate.reasonForDisabling;
        }
      }
    });

    return isAvailable;
  }

  getCardRate(amount: number): number {
    this.notFound = false;
    this.disabledMessage = null;
    this.computedRate = 0;

    if (this.currentRates.length) {
      this.notFound = this.isRateAvailable(amount);
    } else {
      this.notFound = true;
    }

    return this.computedRate;
  }

  getValue(val): void {
    this.valueFromHeader = val;
  }

  gotoAllCards(): void {
    this.router.navigateByUrl('/dashboard/gift-cards');
  }

  selectCard(event): void {
    // console.log(event);
    if (this.f.country.value) {
      this.getCardRates();
    }
  }

  selectCountry(event): void {
    this.getCardRates();
  }

  getAmount(): number {
    const amount = this.getCardRate(this.f.card_value.value) * this.f.card_value.value;

    this.cardForm.patchValue({
      amount
    });

    return amount;
  }

  proceedToconfirmation(): void {
    this.submitted = true;

    if (this.cardForm.invalid) {
      return;
    }

    if (!this.f.amount.value || this.disabledMessage) {
      this.toastrService.warning('Cannot buy card with zero value!');
      return;
    }

    $('#uploadImagesModal').modal('show');
  }

  getCardRates(): void {
    this.loading = true;

    const country = this.f.country.value;
    const type = this.f.card_type.value;

    if (!country.length && !type.length) {
      this.toastrService.warning('Please input both country and card type');
      return;
    }

    this.dataService.getCardRates(this.cardId, country, type).subscribe(
      (res: any) => {
        if (res.status) {
          this.currentRates = res.data;
        }
        this.loading = false;
      },
      err => {
        console.error(err);
        this.toastrService.error('An error occured while fetching card details with country and type');
      }
    );
  }

  makeTransaction(): void {
    if (this.cardForm.invalid) {
      return;
    }

    if (!this.uploadedImages.length) {
      this.toastrService.warning('Please upload at least one image!');
      return;
    }

    this.loading = true;

    const obj = {
      transactions: {
        card: this.cardName,
        country: this.f.country.value,
        rate: this.computedRate,
        card_type: this.f.card_type.value,
        card_value: this.f.card_value.value,
        card_image: this.uploadedImages,
        ...(this.f.card_digits.value.length && { card_digits: this.f.card_digits.value }),
        amount: this.f.amount.value
      },
      totalAmount: this.f.amount.value
    };

    this.dataService.sellCard(obj).subscribe(
      (res: any) => {
        if (res.status) {
          this.toastrService.success(`Your transaction is processing!`);
          this.loading = false;

          $('#uploadImagesModal').modal('hide');
          $('#ratingsModal').modal('show');

          // setTimeout(() => {
          //   window.location.reload();
          // }, 2000);
        }
      },
      err => {
        console.error(err);
        this.loading = false;
        this.toastrService.error('Oops, something went wrong!. Please try again!');
      }
    );
  }

  sendFeedback(): void {
    if (this.ratesForm.invalid) {
      return;
    }

    this.loading = true;

    const obj = {
      rate: this.r.rate.value,
      message: this.r.message.value
    };

    this.dataService.postFeedback(obj).subscribe(
      (res: any) => {
        if (res.status) {
          this.toastrService.success('Your feedback has been sent!');
          this.loading = false;

          // $('#ratingsModal').modal('hide');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      },
      err => {
        console.error(err);
        this.loading = false;
        this.toastrService.error('Oops, something went wrong!. Please try again!');
      }
    );
  }
}
