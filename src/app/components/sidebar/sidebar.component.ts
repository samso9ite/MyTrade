import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { isMobile } from 'src/app/helpers';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() showMenu;
  isMobile = false;
  userInfo = {
    fullname: '',
    email: '',
    image: ''
  };

  constructor(private router: Router, private dataService: DataService) {
    const userId = localStorage.getItem('uui');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.isMobile = isMobile();

    if (userInfo) {
      this.userInfo = userInfo;
    } else {
      // this.dataService.getUserInformation(userId).subscribe(
      //   (res: any) => {
      //     this.userInfo = {
      //       firstName: res.firstName,
      //       lastName: res.lastName,
      //       email: res.email
      //     };
      //   },
      //   err => {
      //     console.log(err);
      //   }
      // );
    }
  }

  ngOnInit(): void {}

  gotoRedeemCard(): void {
    window.location.href = '/dashboard/gift-cards';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
