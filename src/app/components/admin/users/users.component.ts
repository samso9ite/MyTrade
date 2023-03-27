import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { ColumnMode } from '@swimlane/ngx-datatable';

declare var $;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  ColumnMode = ColumnMode;
  loading = false;
  allUsers = [];

  selectedUser = {
    phone: '',
    email: '',
    fullname: '',
    image: '',
    accountInfo: []
  };

  constructor(private dataService: DataService, private toastrService: ToastrService) {
    this.loading = false;

    this.dataService.getAllUsers().subscribe(
      (res: any) => {
        // console.log(res);
        if (res.status) {
          this.allUsers = res.data;
        }
        this.loading = false;
      },
      err => {
        console.error(err);
        this.toastrService.error(err.message);
        this.loading = false;
      }
    );
  }

  ngOnInit(): void {}

  onSelectUser(user): void {
    this.selectedUser = user;

    $('#userAccountsModal').modal('show');
  }
}
