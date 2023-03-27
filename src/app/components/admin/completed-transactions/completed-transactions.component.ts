import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ColumnMode } from '@swimlane/ngx-datatable';
import * as moment from 'moment';

declare var $;

@Component({
  selector: 'app-completed-transactions',
  templateUrl: './completed-transactions.component.html',
  styleUrls: ['./completed-transactions.component.scss']
})
export class CompletedTransactionsComponent implements OnInit {
  loading = false;
  storeId: string;

  allTransactions = [];
  declineForm: FormGroup;
  paymentForm: FormGroup;
  submitted = false;
  ColumnMode = ColumnMode;

  users = [];
  approved = [];
  pending = [];
  paid = [];

  selectedTransaction = {
    _id: '',
    transaction_reference: '',
    card_image: '',
    card: '',
    card_type: '',
    card_receipt: '',
    card_receipt_type: '',
    card_value: 0,
    card_digits: '',
    date: '',
    rate: '',
    status: '',
    amount: 0,
    country: '',
    user: {
      phone: '',
      email: '',
      fullname: '',
      image: '',
      accountInfo: []
    }
  };

  constructor(
    private dataService: DataService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
  ) {
    this.loading = true;

    this.getApprovedCardTransactions();
  }

  ngOnInit(): void {
    this.declineForm = this.formBuilder.group({
      reasonForDeclination: ['', Validators.required]
    });

    this.paymentForm = this.formBuilder.group({
      receiptImage: ['', Validators.required]
    });
  }

  get f() {
    return this.declineForm.controls;
  }

  get p() {
    return this.paymentForm.controls;
  }

  onUploadCardFinished(event: any): void {
    // console.log(event.serverResponse.response.body.data.link);

    this.paymentForm.patchValue({
      receiptImage: event.serverResponse.response.body.data.link
    });
  }

  getApprovedCardTransactions(): void {
    this.dataService.getApprovedTransactions().subscribe((res: any) => {
      // console.log(res.data);
      if (res.status) {
        this.allTransactions = res.data;

        this.allTransactions = this.allTransactions.map(transaction => {
          transaction.date = moment(transaction.created_at).format('DD/MMM/YYYY HH:MM:SS');

          return transaction;
        });
        this.loading = false;
      } else {
        this.toastrService.error('An error occured while fetching transactions');
        this.loading = false;
      }
    }, err => {
      console.error(err);
      this.loading = false;
      this.toastrService.error('An error occured while fetching transactions');
    });
  }

  onApproveTransaction(transaction): void {
    this.selectedTransaction = transaction;
    $('#approveModal').modal('show');
  }

  onViewTransaction(transaction): void {
    this.selectedTransaction = transaction;
    $('#detailsModal').modal('show');
  }

  onDeclineTransaction(transaction): void {
    this.selectedTransaction = transaction;
    $('#declineModal').modal('show');
  }

  declineCardTransaction(): void {
    this.submitted = true;

    if (this.declineForm.invalid) {
      return;
    }

    const obj = {
      transaction_id: this.selectedTransaction._id,
      reasonForDeclination: this.f.reasonForDeclination.value
    };

    this.loading = true;

    this.dataService.declineCardTransaction(obj).subscribe((res: any) => {
      console.log(res);
      if (res.status) {
        this.loading = false;
        this.toastrService.success('Successfully declined the card');
        window.location.reload();
      }
    }, err => {
      console.error(err);
      this.loading = false;
      this.toastrService.error('An error occured while declining this card');
    });
  }

  approveCardTransaction(): void {
    this.loading = true;

    const obj = {
      transaction_id: this.selectedTransaction._id
    };

    this.dataService.approveCardTransaction(obj).subscribe((res: any) => {
      if (res.status) {
        this.loading = false;
        this.toastrService.success('Approved Transaction Successfully');
        window.location.reload();
      }
    }, err => {
      console.error(err);
      this.toastrService.error('An error occured while approving this transaction');
      this.loading = false;
    });
  }

  uploadPaymentReceipt(): void {
    $('#detailsModal').modal('hide');
    $('#receiptModal').modal('show');
  }

  payOutCardTransaction(): void {
    if (window.confirm('Are you sure you want to pay for this transaction?')) {

      this.submitted = true;
      if (this.paymentForm.invalid) {
        return;
      }

      this.loading = true;

      const obj = {
        transaction_id: this.selectedTransaction._id,
        paymentReceipt: this.p.receiptImage.value
      };

      this.dataService.payoutCardTransaction(obj).subscribe((res: any) => {
        if (res.status) {
          this.loading = false;
          this.toastrService.success('Paid For Card Transaction Successfully');
          window.location.reload();
        }
      }, err => {
        console.error(err);
        this.toastrService.error('An error occured while paying for this transaction');
        this.loading = false;
      });
    }
  }

}
