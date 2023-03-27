import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';

declare var $;

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit, AfterContentChecked {
  valueFromHeader;

  loading = false;
  submitted = false;
  submitting = false;

  cardForm: FormGroup;
  rateForm: FormGroup;

  card = {
    image: '',
    name: '',
    rates: []
  };
  cardTypes = [];
  countries = [];
  allCards = [];
  rawCountries = [];

  notFound;
  disabledMessage = null;
  currentRates = [];
  computedRate = 0;
  selectedCardId = '';
  selectedRate = {
    cardType: '',
    country: '',
    denomination: '',
    rate: 0
  };

  constructor(
    private dataService: DataService,
    private toastrService: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.loading = true;

    this.dataService.getCountries().subscribe(
      (res: any) => {
        this.rawCountries = res;
      },
      err => console.error(err)
    );

    this.dataService.getAllCards().subscribe(
      (res: any) => {
        if (res.status) {
          this.allCards = res.data;
        }
        this.loading = false;
      },
      err => {
        console.error(err);
        this.toastrService.error(err.message);
        this.loading = false;
      }
    );
  }

  ngOnInit(): void {
    this.cardForm = this.formBuilder.group({
      card: ['', Validators.required],
      card_type: ['', Validators.required],
      card_digits: [''],
      card_value: ['', Validators.required],
      country: ['', Validators.required],
      card_receipt_image: [''],
      amount: ['', Validators.required]
    });

    this.rateForm = this.formBuilder.group({
      card: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['']
    });
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  get f(): any {
    return this.cardForm.controls;
  }

  get r(): any {
    return this.rateForm.controls;
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

  findCountryCurrency(country: string): string {
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

  selectCard(event): void {
    this.loading = true;
    const card = JSON.parse(event.target.value);
    this.selectedCardId = card._id;

    this.dataService.getCardDetails(this.selectedCardId).subscribe(
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

  selectRate(event): void {
    this.selectedRate = JSON.parse(event.target.value);
  }

  viewRateDetails(): void {
    if (!this.r.card.value.length) {
      this.toastrService.warning('Please select a card!');
      return;
    }

    if (!this.selectedRate.cardType.length) {
      this.toastrService.warning('Please select a rate!');
      return;
    }

    $('#rateDetailsModal').modal('show');
  }

  selectType(event): void {
    if (this.f.country.value) {
      this.getCardRates();
    }
  }

  selectCountry(event): void {
    this.getCardRates();
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

  getAmount(): number {
    const amount = this.getCardRate(this.f.card_value.value) * this.f.card_value.value;

    this.cardForm.patchValue({
      amount
    });

    return amount;
  }

  getCardRates(): void {
    this.loading = true;

    const country = this.f.country.value;
    const type = this.f.card_type.value;

    if (!country.length && !type.length) {
      this.toastrService.warning('Please input both country and card type');
      return;
    }

    this.dataService.getCardRates(this.selectedCardId, country, type).subscribe(
      (res: any) => {
        // console.log(res.data);
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
}
