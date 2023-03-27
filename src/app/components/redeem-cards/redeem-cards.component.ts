import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-redeem-cards',
  templateUrl: './redeem-cards.component.html',
  styleUrls: ['./redeem-cards.component.scss']
})
export class RedeemCardsComponent implements OnInit {
  valueFromHeader;
  physical = true;
  ecode = false;
  placeholder = 'Optional';
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    class: 'custom_modal_transaction_pin animate__animated animate__fadeInDown'
  };
  loading = false;
  submitted = false;
  submitting = false;
  cardForm: FormGroup;
  cards = [];
  selectedCard = {
    name: '',
    _id: '',
    rates: []
  };
  currentRate = 0;
  uploadReceipt = false;
  receipts = [
    'Cash Receipt',
    'Debit Receipt',
    'Credit Receipt',
    'Master Receipt',
    'No Receipt'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private toastrService: ToastrService
  ) {
    this.loading = true;

    this.dataService.getAllAvailableCards().subscribe((res: any) => {
      console.log(res);
      if (res.status) {
        this.loading = false;
        this.cards = res.data;
      }
    }, err => {
      console.error(err);
      this.loading = false;
      this.toastrService.error('An error occured while fetching available cards');
    });
  }

  ngOnInit(): void {
    this.cardForm = this.formBuilder.group({
      card: ['', Validators.required],
      card_name: ['', Validators.required],
      currency: ['', Validators.required],
      currency_name: ['', Validators.required],
      card_type: ['Physical'],
      card_digits: [''],
      card_receipt_type: ['', Validators.required],
      card_value: ['', Validators.required],
      card_image: [''],
      card_receipt_image: [''],
      amount: ['', Validators.required]
    });
  }

  get f() {
    return this.cardForm.controls;
  }

  selectPhysical(): void {
    this.physical = true;
    this.ecode = false;
    this.placeholder = 'Optional';

    this.cardForm.patchValue({
      card_type: 'Physical'
    });
  }

  selectEcode(): void {
    this.ecode = true;
    this.physical = false;
    this.placeholder = 'Required';

    this.cardForm.patchValue({
      card_type: 'E-Code'
    });
  }

  selectCard(event): void {
    this.selectedCard = JSON.parse(event.target.value);

    this.cardForm.patchValue({
      card_name: this.selectedCard.name
    });
  }

  selectCurrency(event): void {
    const currencyObj = JSON.parse(event.target.value);
    this.currentRate = currencyObj.rate;

    this.cardForm.patchValue({
      currency_name: currencyObj.currency
    });
  }

  selectReceipt(event): void {
    if (event.target.value === 'No Receipt') {
      this.uploadReceipt = false;
    } else {
      this.uploadReceipt = true;
    }
  }

  onUploadCardFinished(event: any): void {
    // console.log(event.serverResponse.response.body.data.link);

    this.cardForm.patchValue({
      card_image: event.serverResponse.response.body.data.link
    });
  }

  onRemoveCardImage(): void {
    this.cardForm.patchValue({
      card_image: ''
    });
  }

  onUploadReceiptFinished(event: any): void {
    // console.log(event.serverResponse.response.body.data.link);

    this.cardForm.patchValue({
      card_receipt_image: event.serverResponse.response.body.data.link
    });
  }

  onRemoveReceiptImage(): void {
    this.cardForm.patchValue({
      card_receipt_image: ''
    });
  }

  getAmount(): number {
    const amount = this.currentRate * this.f.card_value.value;

    this.cardForm.patchValue({
      amount
    });

    return amount;
  }

  getValue(val): void {
    this.valueFromHeader = val;
  }

  redeemCard(): void {
    this.submitted = true;

    if (this.cardForm.invalid) {
      return;
    }

    if (this.physical && !this.f.card_image.value) {
      this.toastrService.error('Please upload the image for the card you wish to redeem');
      return;
    }

    if (this.ecode && !this.f.card_digits.value) {
      this.toastrService.error('Please provide the card digits for the e-code card you wish to redeem');
      return;
    }

    if (this.uploadReceipt && !this.f.card_receipt_image.value.length) {
      this.toastrService.error('Please upload a receipt for the card');
      return;
    }

    this.loading = true;

    const obj = {
      transactions: {
        card: this.f.card_name.value,
        currency: this.f.currency_name.value,
        rate: this.currentRate,
        card_type: this.f.card_type.value,
        card_value: this.f.card_value.value,
        card_receipt_type: this.f.card_receipt_type.value,
        ...(this.f.card_image.value.length && {card_image: this.f.card_image.value}),
        ...(this.f.card_digits.value.length && {card_digits: this.f.card_digits.value}),
        ...(this.f.card_receipt_image.value.length && {card_receipt: this.f.card_receipt_image.value}),
        amount: this.f.amount.value
      },
      totalAmount: this.f.amount.value
    };

    this.dataService.sellCard(obj).subscribe((res: any) => {
      if (res.status) {
        this.toastrService.success(`Your card is on it's way to being redeemed`);
        this.loading = false;
        window.location.reload();
      }
    }, err => {
      console.error(err);
      this.loading = false;
      this.toastrService.error('Oops, something went wrong!. Please try again!');
    });
  }

}
