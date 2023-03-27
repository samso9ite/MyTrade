import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gift-cards',
  templateUrl: './gift-cards.component.html',
  styleUrls: ['./gift-cards.component.scss']
})
export class GiftCardsComponent implements OnInit {
  valueFromHeader;
  loading = false;

  cards = [];

  constructor(
    private dataService: DataService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.loading = true;

    this.dataService.getAllAvailableCards().subscribe((res: any) => {
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
  }

  getValue(val): void {
    this.valueFromHeader = val;
  }

  gotoGiftCardPurchase(id: string, name: string): void {
    this.router.navigateByUrl(`/dashboard/gift-card/${name}/${id}`);
  }

}
