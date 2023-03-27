import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  itemNav: any[];
  selectedNavItem;
  items;
  showFirst = 1;

  constructor() {
    this.itemNav = [
      { id: 1, item: 'What is MyTrade?' },
      { id: 2, item: 'Who can open account?' },
      { id: 3, item: 'How do i trade from another country?' },
      { id: 4, item: 'How do i verify my email?' },
      { id: 5, item: 'I can’t signup?' },
    ];
  }

  ngOnInit(): void {
  }

  onSelect(itemNav): void {
    this.items = itemNav;
    this.selectedNavItem = itemNav.id;
    if (this.selectedNavItem !== 1) {
      this.showFirst = 0;
    }
  }

}
