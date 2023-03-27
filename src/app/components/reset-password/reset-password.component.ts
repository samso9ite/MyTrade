import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  submitting = false;
  errMessage: string;
  loading = false;
  success = true;
  valid = false;
  maxLength = 6;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      token: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.resetForm.controls;
  }

  reset(): void {
    this.submitted = false;
  }

  onKey(event: any): void {
    this.submitted = false;
    if (event.target.value.length === this.maxLength) {
      this.valid = true;
    } else {
      this.valid = false;
    }
  }

  onkeyPress(event: any): boolean {
    if (event.target.value.length === this.maxLength) {
      return false;
    }
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

  onResetPassword(): void {
    this.submitted = true;

    if (this.resetForm.invalid) {
      return;
    }

    const obj = {
      email: localStorage.getItem('email'),
      password: this.f.password.value,
      token: this.f.token.value
    };

    this.loading = true;

    this.dataService.resetPassword(obj).subscribe(
      (res: any) => {
        if (!res.status) {
          this.toastrService.error(res.message, 'Error');
        } else {
          this.toastrService.success('Successfully reset your password', 'Success');
          this.success = false;
        }
        this.loading = false;
      },
      err => {
        console.error(err);
        this.loading = false;
        this.toastrService.error('An error occured while updating resetting your password , please try again', 'Error');
      }
    );
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }
}
