import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  submitting = false;
  errMessage: string;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.minLength(8)]],
      // accountType: [null, Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() {
    return this.registerForm.controls;
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

  register(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    if (this.f.password.value !== this.f.confirmPassword.value) {
      this.toastrService.error('Passwords do not match!');
      return;
    }

    const obj = {
      fullname: this.f.fullname.value,
      username: this.f.username.value,
      phone: this.f.phoneNumber.value,
      email: this.f.email.value,
      password: this.f.password.value
    };

    this.submitting = true;
    this.loading = true;

    this.dataService.register(obj).subscribe(
      (res: any) => {
        // console.log(res);
        this.toastrService.success(res.message);
        this.loading = false;
        this.submitting = false;
        localStorage.setItem('email', res.data);
        this.router.navigateByUrl('/verification');
      },
      err => {
        console.error(err);
        this.toastrService.error(err.error.message);
        this.loading = false;
        this.submitting = false;
      }
    );
  }
}
