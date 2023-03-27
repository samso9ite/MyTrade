import { Component, OnInit, TemplateRef, Input, ContentChild, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  valueFromHeader;
  navItem: any[];
  selectedNavItem;
  showFirst = 1;
  done = true;
  modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    class: 'custom_modal_alternate animate__animated animate__fadeInDown'
  };

  changePasswordForm: FormGroup;
  profileForm: FormGroup;
  accountForm: FormGroup;
  submitted = false;
  submitting = false;
  loading = false;
  showActive = false;
  completed = true;
  userCards = [];
  cardId = 0;
  currentCard: any = {};
  selectedAccount: any;
  userInfo = {
    image: ''
  };
  banks = [];
  accountName = null;

  @ContentChild('profileUpdate') profileUpdate: TemplateRef<ElementRef>;

  // tslint:disable-next-line:max-line-length
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private toastrService: ToastrService
  ) {
    this.navItem = [
      { id: 1, item: 'Account' },
      { id: 2, item: 'Manage Bank Account' },
      { id: 3, item: 'Change Password' },
      // { id: 4, item: 'Change Transaction Pin' },
      { id: 5, item: 'Others' }
    ];

    this.loading = true;

    this.dataService.getUserInfo().subscribe((res: any) => {
      if (res.status) {
        console.log(res.data);
        this.userInfo = res.data;
      }
      this.loading = false;
    }, err => {
      console.error(err);
      this.loading = false;
      this.toastrService.error(err.message);
    });

    this.getBanks();
  }

  ngOnInit(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    this.profileForm = this.formBuilder.group({
      fullname: [userInfo.fullname, Validators.required],
      email: [userInfo.email, [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });

    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.accountForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      number: ['', [Validators.required]],
      bank_name: ['', [Validators.required]],
      bank_code: ['', [Validators.required]],
      bank: ['', [Validators.required]]
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  get fp() {
    return this.changePasswordForm.controls;
  }

  get a() {
    return this.accountForm.controls;
  }

  onUploadStateChanged(event: any): void {
    this.loading = true;
  }

  onUploadFinished(event: any): void {
    // console.log(event.serverResponse.response.body.data.link);

    const obj = {
      image: event.serverResponse.response.body.data.link
    };

    this.loading = true;

    this.dataService.changeUserImage(obj).subscribe((res: any) => {
      if (res.status) {
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        window.location.reload();
        this.toastrService.success(`Successfully uploaded image!`);
      }
      this.loading = false;
    }, err => {
      console.error(err);
      this.loading = false;
      this.toastrService.error(`Oops, an error occured while uploading image`);
    });
  }

  deleteAccount(account, template: TemplateRef<any>): void {
    this.selectedAccount = account;
    this.openModalWithClass(template);
  }

  onFocus(): void {
    this.submitted = false;
  }

  getValue(val): void {
    this.valueFromHeader = val;
  }

  openModalWithClass(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSelect(navItem): void {
    this.selectedNavItem = navItem.id;
    if (this.selectedNavItem !== 1) {
      this.showFirst = 0;
    }
  }

  addPin(): void {
    this.showActive = false;
    this.completed = false;
  }

  keyPress(event: any): void {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keyUp(event: any): void {
    if (this.a.number.value.length === 10) {
      this.retrieveAccountInfo(this.a.number.value);
    }
  }

  getSelectedBank(event: any): void {
    const bank = JSON.parse(event.target.value);

    this.accountForm.patchValue({
      bank_name: bank.name,
      bank_code: bank.code
    });
  }

  getBanks(): void {
    this.dataService.getBanks().subscribe((res: any) => {
      // console.log(res);
      if (res.status) {
        this.banks = res.data;
      } else {
        this.toastrService.error('An error occured while fetching banks');
      }
    }, err => {
      console.error(err);
      this.toastrService.error('An error occured while fetching banks');
    });
  }

  retrieveAccountInfo(accountNumber: string): void {
    this.loading = true;
    const obj = {
      account_number: accountNumber,
      bank_code: this.a.bank_code.value
    };

    this.dataService.resolveAccountNumber(obj).subscribe((res: any) => {
      // console.log(res);
      if (res.status) {
        this.accountName = res.data.account_name;

        this.accountForm.patchValue({
          name: res.data.account_name,
          number: res.data.account_number
        });
      } else {
        this.toastrService.error('An error occured while fetching banks');
      }
      this.loading = false;
    }, err => {
      console.error(err);
      this.toastrService.error('Error occured while resolving account number');
      this.loading = false;
    });
  }

  addAccountInformation(): void {
    this.submitted = true;

    if (this.accountForm.invalid) {
      return;
    }

    const obj = {
      name: this.a.name.value,
      number: this.a.number.value,
      bank_name: this.a.bank_name.value,
      bank_code: this.a.bank_code.value
    };

    this.loading = true;

    this.dataService.addAccountInfo(obj).subscribe((res: any) => {
      console.log(res);
      if (res.status) {
        this.toastrService.success(`The account has been successfully added`);
        this.userInfo = res.data;
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        this.loading = false;
        window.location.reload();
      }
    }, err => {
      console.error(err);
      this.loading = false;
      this.toastrService.error(`An error occured while trying to add a card`);
    });
  }

  selectAccountAsActive(account): void {
    this.loading = false;

    this.selectedAccount = account;

    const obj = {
      account_id: this.selectedAccount._id
    };

    this.dataService.selectAccountAsActive(obj).subscribe((res: any) => {
      if (res.status) {
        this.toastrService.success(`The account has been selected successfully`);
        this.loading = false;
        this.userInfo = res.data;
        localStorage.setItem('userInfo', JSON.stringify(res.data));
      }
    }, err => {
      console.error(err);
      this.loading = false;
      this.toastrService.error(`An error occured while trying to select this account`);
    });
  }

  deleteUserAccount(): void {
    this.loading = true;

    this.dataService.deleteAccount(this.selectedAccount._id).subscribe((res: any) => {
      if (res.status) {
        this.toastrService.success(`The account has been successfully deleted`);
        this.loading = false;
        this.userInfo = res.data;
        localStorage.setItem('userInfo', JSON.stringify(res.data));
        window.location.reload();
      }
    }, err => {
      console.error(err);
      this.loading = false;
      this.toastrService.error(`An error occured while trying to delete this account`);
    });
  }

  changePassword(): void {
    this.submitted = true;

    if (this.changePasswordForm.invalid) {
      return;
    }

    if (this.fp.password.value !== this.fp.confirmPassword.value) {
      this.toastrService.warning('Passwords do not match', 'Warning');
      return;
    }

    const obj = {
      userId: localStorage.getItem('userId'),
      currentPassword: this.fp.currentPassword.value,
      password: this.fp.password.value,
      confirmPassword: this.fp.confirmPassword.value
    };

    // console.log(obj);

    this.loading = true;
    this.submitting = true;

    // this.dataService.changePassword(obj).subscribe(
    //   res => {
    //     this.loading = false;
    //     this.submitted = false;
    //     this.changePasswordForm.reset();
    //     this.toastrService.success('Your password have been changed successfully', 'Success');
    //   },
    //   err => {
    //     console.log(err);
    //     this.loading = false;
    //     this.toastrService.error('An error occured while changing your password, please try again', 'Error');
    //   }
    // );

    this.submitting = false;
  }

  updateProfile(template: TemplateRef<any>): void {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    const userInfoLocal = JSON.parse(localStorage.getItem('userInfo'));

    const obj = {
      id: localStorage.getItem('userId'),
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      email: this.f.email.value,
      address: this.f.address.value,
      gender: 'male',
      dateOfBirth: null,
      accountType: userInfoLocal.accountType
    };

    this.loading = true;
    this.submitting = true;

    // this.dataService.updateProfile(obj).subscribe(
    //   res => {
    //     // console.log(res);
    //     localStorage.removeItem('userInfo');
    //     const userInfo = {
    //       firstName: this.f.firstName.value,
    //       lastName: this.f.lastName.value,
    //       email: this.f.email.value,
    //       address: this.f.address.value,
    //       accountType: userInfoLocal.accountType
    //     };
    //     localStorage.setItem('userInfo', JSON.stringify(userInfo));

    //     this.loading = false;
    //     this.toastrService.success('Your profile has beeen updated successfully', 'Success');
    //     this.openModalWithClass(template);
    //   },
    //   err => {
    //     console.log(err);
    //     this.loading = false;
    //     this.toastrService.error('An error occured while updating your profile, please try again', 'Error');
    //   }
    // );

    this.submitting = false;
  }

  reload(): void {
    window.location.reload();
  }
}
