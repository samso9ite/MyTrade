import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCardDetailsComponent } from './admin-card-details.component';

describe('AdminCardDetailsComponent', () => {
  let component: AdminCardDetailsComponent;
  let fixture: ComponentFixture<AdminCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
