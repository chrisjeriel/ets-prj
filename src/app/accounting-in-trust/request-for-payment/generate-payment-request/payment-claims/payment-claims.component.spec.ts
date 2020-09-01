import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentClaimsComponent } from './payment-claims.component';

describe('PaymentClaimsComponent', () => {
  let component: PaymentClaimsComponent;
  let fixture: ComponentFixture<PaymentClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
