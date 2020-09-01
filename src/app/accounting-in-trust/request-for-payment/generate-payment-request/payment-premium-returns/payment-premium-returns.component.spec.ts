import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPremiumReturnsComponent } from './payment-premium-returns.component';

describe('PaymentPremiumReturnsComponent', () => {
  let component: PaymentPremiumReturnsComponent;
  let fixture: ComponentFixture<PaymentPremiumReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentPremiumReturnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPremiumReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
