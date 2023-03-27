import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss']
})
export class FeedbacksComponent implements OnInit {
  ColumnMode = ColumnMode;
  loading = false;
  feedbacks = [];

  constructor(private dataService: DataService, private toastrService: ToastrService) {
    this.loading = false;

    this.dataService.getAllFeedbacks().subscribe(
      (res: any) => {
        if (res.status) {
          this.feedbacks = res.data;
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

  toggleFeedbackState(id: string): void {
    const obj = {
      feedbackId: id
    };

    this.loading = true;

    this.dataService.toggleFeedbackState(obj).subscribe(
      (res: any) => {
        if (res.status) {
          this.toastrService.success('Successfully saved feedback state');
        }
        window.location.reload();
        this.loading = false;
      },
      err => {
        console.error(err);
        this.toastrService.error(err.message);
        this.loading = false;
      }
    );
  }
}
