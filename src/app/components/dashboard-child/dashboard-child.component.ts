import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';

declare var $;

@Component({
  selector: 'app-dashboard-child',
  templateUrl: './dashboard-child.component.html',
  styleUrls: ['./dashboard-child.component.scss']
})
export class DashboardChildComponent implements OnInit {
  loading = false;
  valueFromHeader;
  @ViewChild('scrollCards') scrollCards;
  empty = true;
  user = {
    availableAmount: 0,
    pendingAmount: 0,
    card_transactions: []
  };
  transactions = [];
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
    reasonForDeclination: '',
    paymentReceipt: ''
  };

  constructor(
    private dataService: DataService,
    private toastrService: ToastrService,
  ) {
    this.loading = true;

    this.dataService.getUserInfo().subscribe((res: any) => {
      if (res.status) {
        this.user = res.data;
        this.transactions = this.user.card_transactions.slice(0, 20);
      }
      this.loading = false;
    }, err => {
      console.error(err);
      this.loading = false;
      this.toastrService.error(err.message);
    });
  }

  ngOnInit(): void {
  }

  scrollRight(): void {
    this.scrollCards.nativeElement.scrollTo({
      left: this.scrollCards.nativeElement.scrollLeft + 150,
      behavior: 'smooth'
    });
  }

  scrollLeft(): void {
    this.scrollCards.nativeElement.scrollTo({
      left: this.scrollCards.nativeElement.scrollLeft - 150,
      behavior: 'smooth'
    });
  }

  getValue(val): void {
    this.valueFromHeader = val;
  }

  getFormattedDate(date): any {
    return moment(date).format('DD/MMM/YYYY hh:mm A');
  }

  gotoDetails(transaction): void {
    this.selectedTransaction = transaction;
    $('#viewDetailsModal').modal('show');
  }

}
