import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loading = false;
  showNotification = false;
  showMenu = false;
  notifications = [];
  @Output() outputToParent = new EventEmitter<any>();

  constructor(private dataService: DataService, private toastrService: ToastrService) {
    this.loading = true;
    // this.dataService.getNotifications(40).subscribe(
    //   (res: any) => {
    //     this.notifications = res.items;
    //     this.loading = false;
    //   },
    //   err => {
    //     console.error(err);
    //     this.loading = false;
    //     this.toastrService.error(err.message, 'Error');
    //   }
    // );
  }

  ngOnInit(): void {}

  triggerMenu(): void {
    this.showMenu = !this.showMenu;
    this.outputToParent.emit(this.showMenu);
  }

  openNotification(): void {
    this.showNotification = !this.showNotification;
  }

  getFormattedDate(date): string {
    return moment(date).format('DD/MM/YYYY');
  }
}
