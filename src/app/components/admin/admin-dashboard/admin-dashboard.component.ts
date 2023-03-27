import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  loading = false;
  showNotification = false;
  showMenu = false;
  notifications = [];
  @Output() outputToParent = new EventEmitter<any>();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  triggerMenu(): void {
    this.showMenu = !this.showMenu;
    this.outputToParent.emit(this.showMenu);
  }

  openNotification(): void {
    this.showNotification = !this.showNotification;
  }

  getFormattedDate(date): any {
    return moment(date).format('DD/MM/YYYY');
  }

  showSideNav(): void {
    document.getElementById('sidenav').style.width = '250px';
    document.getElementById('main').style.marginLeft = '250px';
  }

  closeSideNav(): void {
    if (window.innerWidth < 770) {
      document.getElementById('sidenav').style.width = '0px';
      document.getElementById('main').style.marginLeft = '0px';
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/admin/login']);
  }

}
