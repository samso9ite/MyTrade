import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private jwtHelper: JwtHelperService, private router: Router) {}

  isLoggedIn(): any {
    const token = window.location.href.includes('/admin') ? localStorage.getItem('puui') : this.jwtHelper.tokenGetter();
    if (token !== null) {
      try {
        if (this.jwtHelper.isTokenExpired(token)) {
          return false;
        } else {
          return true;
        }
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  }

  isLoggedOut(): any {
    return !this.isLoggedIn();
  }
}
