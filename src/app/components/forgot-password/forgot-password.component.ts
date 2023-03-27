import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  submitted = false;
  submitting = false;
  errMessage: string;
  loading = false;
  success = true;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgotForm.controls;
  }

  reset(): void {
    this.submitted = false;
  }

  onFocus(): void {
    this.errMessage = undefined;
    this.submitted = false;
  }

  keyPress(event: any): void {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onForgotPassword(): void {
    this.submitted = true;

    if (this.forgotForm.invalid) {
      return;
    }

    const obj = {
      email: this.f.email.value,
    };

    this.loading = true;

    this.dataService.forgotPassword(obj).subscribe(
      (res: any) => {
        if (!res.status) {
          this.toastrService.error(res.message, 'Error');
        } else {
          localStorage.setItem('email', this.f.email.value);
          this.toastrService.success('Successfully sent verification code to your email', 'Success');
          this.success = false;
        }
        this.loading = false;
      },
      err => {
        console.log(err);
        this.loading = false;
        this.toastrService.error('An error occured while processing information, please try again', 'Error');
      }
    );
  }

}
