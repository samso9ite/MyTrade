import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  verificationForm: FormGroup;
  submitted = false;
  submitting = false;
  errMessage: string;
  loading = false;
  valid = false;
  maxLength = 6;
  success = true;
  last4digits = '******';
  fullname: string;
  referenceNumber: string;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private toastrService: ToastrService
  ) { 
  }

  ngOnInit(): void {
    this.verificationForm = this.formBuilder.group({
      token: ['', Validators.required]
    });
  }

  get f() {
    return this.verificationForm.controls;
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

  resendVerificationOtp(): void {
    this.loading = true;

    const obj = {
      email: localStorage.getItem('email')
    };

    this.dataService.resendEmailToken(obj).subscribe(
      (res: any) => {
        if (!res.status) {
          this.toastrService.error(res.message, 'Error');
        } else {
          this.toastrService.success('Successfully resent token, please check your email', 'Success', {
            timeOut: 2000
          });
        }
        this.loading = false;
      },
      err => {
        console.error(err);
        this.loading = false;
        this.toastrService.error(err.message, 'Error', {
          timeOut: 2000
        });
      }
    );
  }

  onVerify(): void {
    this.submitted = true;

    if (this.verificationForm.invalid) {
      return;
    }

    const obj = {
      token: this.f.token.value,
      email: localStorage.getItem('email')
    };

    this.loading = true;

    this.dataService.verifyEmailToken(obj).subscribe(
      (res: any) => {
        if (!res.status) {
          this.toastrService.error(res.message, 'Error');
        } else {
          this.success = false;
          this.fullname = res.data.fullname;
          localStorage.setItem('uui', res.token);
          localStorage.setItem('userInfo', JSON.stringify(res.data));
        }
      },
      err => {
        console.error(err);
        this.toastrService.error('An error occured while verifying your information, please try again', 'Error');
      }
    );

    this.loading = false;
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }

}
