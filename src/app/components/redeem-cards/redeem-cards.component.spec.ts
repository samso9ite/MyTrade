import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemCardsComponent } from './redeem-cards.component';

describe('RedeemCardsComponent', () => {
  let component: RedeemCardsComponent;
  let fixture: ComponentFixture<RedeemCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedeemCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
