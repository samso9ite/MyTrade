import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  submitting = false;
  errMessage: string;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private toastrService: ToastrService
  ) { 
    if (Boolean(this.authService.isLoggedIn())) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onFocus(): void {
    this.errMessage = undefined;
    this.submitted = false;
  }

  login(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const obj = {
      email: this.f.username.value,
      password: this.f.password.value
    };
    this.loading = true;
    this.submitting = true;

    this.dataService.login(obj).subscribe((res: any) => {
      // console.log(res);
      if (res.status) {
        this.toastrService.success('Logged In Successfully!');
        localStorage.setItem('uui', res.token);
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        // this.router.navigateByUrl('dashboard');
        window.location.href = '/dashboard';
        this.loading = false;
      } else {
        this.toastrService.error(res.message);
        this.loading = false;
      }
    }, err => {
      console.error(err);
      this.toastrService.error(err.error.message);
      this.loading = false;
    });

    this.submitting = false;
  }

}
