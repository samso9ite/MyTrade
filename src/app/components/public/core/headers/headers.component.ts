import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit {
  showMenu = false;
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn = Boolean(this.authService.isLoggedIn());
  }

  ngOnInit(): void {
  }

  triggerMenu(): void {
    this.showMenu = !this.showMenu;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
