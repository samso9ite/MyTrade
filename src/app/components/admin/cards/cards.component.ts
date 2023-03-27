import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { ColumnMode } from '@swimlane/ngx-datatable';
import * as moment from 'moment';

declare var $;

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  createCardForm: FormGroup;
  ratingForm: FormGroup;
  disableRateForm: FormGroup;
  ColumnMode = ColumnMode;
  loading = false;
  allCards = [];
  countries = [];

  dropdownSettings = {};
  categoryDropdownSettings = {};

  editting = false;
  submitted = false;
  submitting = false;

  cardId = '';
  rateId = '';
  selectedCard = {
    name: '',
    _id: '',
    rates: []
  };
  selectedRate = '';

  constructor(
    private dataService: DataService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.loading = true;

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

    this.dataService.getCountries().subscribe(
      (res: any) => {
        this.countries = res;
      },
      err => console.error(err)
    );
  }

  ngOnInit(): void {
    this.createCardForm = this.formBuilder.group({
      name: ['', Validators.required],
      image: ['', Validators.required]
    });

    this.ratingForm = this.formBuilder.group({
      country: ['', Validators.required],
      rate: ['', Validators.required],
      allDaySales: [true],
      startProcessingTime: [''],
      endProcessingTime: [''],
      cardType: ['', Validators.required],
      denomination: ['', Validators.required]
    });

    this.disableRateForm = this.formBuilder.group({
      reasonToDisable: ['', Validators.required]
    });

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };

    this.categoryDropdownSettings = {
      ...this.dropdownSettings,
      textField: 'altname'
    };
  }

  get f() {
    return this.createCardForm.controls;
  }

  get r() {
    return this.ratingForm.controls;
  }

  get d() {
    return this.disableRateForm.controls;
  }

  onCreateCard(): void {
    this.editting = false;
    this.createCardForm.reset();
  }

  onCountrySelect(country: any): void {
    this.ratingForm.patchValue({
      country: country.name
    });
  }

  onSelectAll(countries: any): void {
    // console.log(countries);
  }

  onUploadCardFinished(event: any): void {
    // console.log(event.serverResponse.response.body.data.link);

    this.createCardForm.patchValue({
      image: event.serverResponse.response.body.data.link
    });
  }

  onRemoveCardImage(): void {
    this.createCardForm.patchValue({
      image: ''
    });
  }

  onEditCard(card: any): void {
    this.editting = true;

    this.cardId = card._id;
    this.f.name.setValue(card.name);

    $('#createCardModal').modal('show');
  }

  onEditCardRate(rate: any): void {
    this.editting = true;

    this.rateId = rate._id;
    this.r.country.setValue(rate.country);
    this.r.rate.setValue(rate.rate);
    this.r.startProcessingTime.setValue(rate.startProcessingTime);
    this.r.endProcessingTime.setValue(rate.endProcessingTime);
    this.r.cardType.setValue(rate.cardType);
    this.r.denomination.setValue(rate.denomination);

    $('#addRatingToCardModal').modal('show');
  }

  onAddRatingToCard(card): void {
    this.cardId = card._id;
    this.selectedCard = card;

    $('#allRatesModal').modal('show');
  }

  addNewRate(): void {
    $('#allRatesModal').modal('hide');
    $('#addRatingToCardModal').modal('show');
  }

  oopDisableRateModal(): void {
    $('#allRatesModal').modal('hide');
    $('#disableRateSalesModal').modal('show');
  }

  disableRateSales(): void {
    this.submitted = true;
    if (this.disableRateForm.invalid) {
      return;
    }

    const obj = {
      reasonForDisabling: this.d.reasonToDisable.value
    };

    this.dataService.disableRateSales(this.selectedRate, obj).subscribe(
      (res: any) => {
        if (res.status) {
          setTimeout(() => {
            window.location.reload();
          }, 500);
          this.toastrService.success('Rate sales disabled successfully');
        }
      },
      err => {
        console.error(err);
        this.toastrService.error('Error occured while disabling rate sales');
      }
    );
  }

  toggleCardRateSales(rateId: string, toggleState: string): void {
    if (toggleState === 'Enable') {
      this.dataService.enableRateSales(rateId).subscribe(
        (res: any) => {
          if (res.status) {
            setTimeout(() => {
              window.location.reload();
            }, 500);
            this.toastrService.success('Rate sales enabled successfully');
          }
        },
        err => {
          console.error(err);
          this.toastrService.error('Error occured while enable rate sales');
        }
      );
    } else {
      if (window.confirm('Are you sure you want to diable this rate sales?')) {
        this.selectedRate = rateId;
        this.oopDisableRateModal();
      }
    }
  }

  createCard(): void {
    this.submitted = true;

    if (this.createCardForm.invalid) {
      return;
    }

    this.loading = true;

    const obj = {
      name: this.f.name.value,
      image: this.f.image.value
    };

    this.dataService.addCard(obj).subscribe(
      (res: any) => {
        if (res.status) {
          setTimeout(() => {
            window.location.reload();
          }, 500);

          this.toastrService.success('Sucessfully created the card');
        } else {
          this.toastrService.error('An error occured while creating card');
        }
        this.loading = false;
        this.submitted = false;
      },
      err => {
        console.error(err);
        this.loading = false;
        this.submitted = false;
      }
    );
  }

  editCard(): void {
    this.submitted = true;

    if (this.createCardForm.invalid) {
      return;
    }

    this.loading = true;

    const obj = {
      card_id: this.cardId,
      name: this.f.name.value,
      image: this.f.image.value
    };

    this.dataService.editCard(this.cardId, obj).subscribe(
      (res: any) => {
        if (res.status) {
          setTimeout(() => {
            window.location.reload();
          }, 500);
          this.toastrService.success('Editted store card successfully');
        }
        this.loading = false;
        this.submitted = false;
      },
      err => {
        console.error(err);
        this.loading = false;
        this.submitted = false;
        this.toastrService.error('An error occured while editing card');
      }
    );
  }

  deleteCard(id: string): void {
    if (window.confirm('Are you sure you want to delete this card?')) {
      this.loading = true;

      this.dataService.deleteCard(id).subscribe(
        (res: any) => {
          if (res.status) {
            window.location.reload();
          } else {
            this.toastrService.error('An error occured while deleting the card');
          }
          this.loading = false;
        },
        err => {
          console.log(err);
          this.toastrService.error('An error occured while deleting the card');
          this.loading = false;
        }
      );
    }
  }

  freezeCardSales(name: string, id: string): void {
    const obj = {
      card_id: id
    };

    this.loading = true;

    this.dataService.freezeCard(obj).subscribe(
      (res: any) => {
        if (res.status) {
          console.log(res);
          this.loading = false;
          window.location.reload();
          this.toastrService.success(`Successfully paused ${name} card sales!`);
        }
      },
      err => {
        console.error(err);
        this.loading = false;
        this.toastrService.error(`An error occured, please try again!`);
      }
    );
  }

  resumeCardSales(name: string, id: string): void {
    const obj = {
      card_id: id
    };

    this.loading = true;

    this.dataService.makeCardSellable(obj).subscribe(
      (res: any) => {
        if (res.status) {
          console.log(res);
          this.loading = false;
          window.location.reload();
          this.toastrService.success(`Successfully resumed ${name} card sales!`);
        }
      },
      err => {
        console.error(err);
        this.loading = false;
        this.toastrService.error(`An error occured, please try again!`);
      }
    );
  }

  addRatingToCard(): void {
    this.submitted = true;

    if (this.ratingForm.invalid) {
      return;
    }

    this.loading = true;

    const obj = {
      card_id: this.cardId,
      country: this.r.country.value,
      rate: this.r.rate.value,
      ...(this.r.startProcessingTime.value.length && {
        processingTime: `${this.r.startProcessingTime} - ${this.r.endProcessingTime}`
      }),
      cardType: this.r.cardType.value,
      denomination: this.r.denomination.value
    };

    this.dataService.addRateToCard(obj).subscribe(
      (res: any) => {
        if (res.status) {
          setTimeout(() => {
            window.location.reload();
          }, 500);
          this.toastrService.success('Editted store card successfully');
        }
        this.loading = false;
        this.submitted = false;
      },
      err => {
        console.error(err);
        this.loading = false;
        this.submitted = false;
        this.toastrService.error('An error occured while editing card');
      }
    );
  }

  editCardRate(): void {
    this.submitted = true;

    if (this.ratingForm.invalid) {
      return;
    }

    this.loading = true;

    const obj = {
      country: this.r.country.value,
      rate: this.r.rate.value,
      ...(this.r.startProcessingTime.value?.length && {
        processingTime: `${this.r.startProcessingTime} - ${this.r.endProcessingTime}`
      }),
      cardType: this.r.cardType.value,
      denomination: this.r.denomination.value
    };

    this.dataService.editCardRating(this.rateId, obj).subscribe(
      (res: any) => {
        if (res.status) {
          setTimeout(() => {
            window.location.reload();
          }, 500);
          this.toastrService.success('Editted card rates successfully');
        }
        this.loading = false;
        this.submitted = false;
      },
      err => {
        console.error(err);
        this.loading = false;
        this.submitted = false;
        this.toastrService.error('An error occured while editing card');
      }
    );
  }

  deleteCardRate(id: string): void {
    if (window.confirm('Are you sure you want to delete this rate?')) {
      this.loading = true;

      this.dataService.deleteCardRate(id).subscribe(
        (res: any) => {
          if (res.status) {
            window.location.reload();
          } else {
            this.toastrService.error('An error occured while deleting the card rate');
          }
          this.loading = false;
        },
        err => {
          console.log(err);
          this.toastrService.error('An error occured while deleting the card rate');
          this.loading = false;
        }
      );
    }
  }
}
