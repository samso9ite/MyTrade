import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import * as moment from 'moment';

declare var $;

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  valueFromHeader;
  transactions = [];
  user = {
    availableAmount: 0,
    pendingAmount: 0,
    card_transactions: []
  };
  loading = false;
  totalPages = [];
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
    currency: '',
    paymentReceipt: ''
  };

  constructor(private dataService: DataService, private toastrService: ToastrService, private router: Router) { 
    this.loading = true;

    this.dataService.getUserInfo().subscribe((res: any) => {
      // console.log(res);
      if (res.status) {
        this.user = res.data;
        this.transactions = this.user.card_transactions.slice(0, 20);
      }
      // console.log(this.transactions);
      this.loading = false;
    }, err => {
      console.error(err);
      this.loading = false;
      this.toastrService.error(err.message);
    });
  }

  ngOnInit(): void {
  }

  getValue(val): void {
    this.valueFromHeader = val;
  }

  getFormattedDate(date): string {
    return moment(date).format('DD MMMM YYYY, HH:mm:ss');
  }

  gotoDetails(transaction): void {
    this.selectedTransaction = transaction;
    $('#viewDetailsModal').modal('show');
  }

}
