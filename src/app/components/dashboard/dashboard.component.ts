import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
// import { DataService } from 'src/app/services/data.service';
// import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('pinsetup') pinsetup;
  modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    class: 'custom_modal_alternate animate__animated animate__fadeInDown'
  };

  constructor(
    private modalService: BsModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // console.log(userInfo);

    if (!userInfo.accountInfo.length) {
      this.triggerModalPinSetup();
    }
  }

  triggerModalPinSetup(): void {
    setTimeout(() => {
      this.openModalWithClass(this.pinsetup);
    }, 1000);
  }

  openModalWithClass(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, this.config);
  }

  linkAccount(): void {
    this.router.navigateByUrl('/dashboard/settings');
    this.modalRef.hide();
  }

}
