import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardChildComponent } from './admin-dashboard-child.component';

describe('AdminDashboardChildComponent', () => {
  let component: AdminDashboardChildComponent;
  let fixture: ComponentFixture<AdminDashboardChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
