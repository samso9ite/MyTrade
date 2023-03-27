import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  submitting = false;
  errMessage: string;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f(): any {
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
      email: this.f.email.value,
      password: this.f.password.value,
    };
    this.loading = true;
    this.submitting = true;

    this.dataService.adminLogin(obj).subscribe(
      (res: any) => {
        if (res.status) {
          this.loading = false;
          localStorage.setItem('puui', res.token);
          localStorage.setItem('email', this.f.email.value);
          this.toastrService.success('Login Successful', 'Success', {
            timeOut: 2000,
          });
          // this.router.navigate(['/admin/dashboard']);
          window.location.href = '/admin/dashboard';
        } else {
          this.loading = false;
          this.toastrService.error(
            'An error occured, please try again later',
            'Error',
          );
        }
      },
      (err) => {
        console.log(err);
        this.loading = false;
        this.toastrService.error('Incorrect username or password', 'Error');
      }
    );

    this.submitting = false;
  }

}
