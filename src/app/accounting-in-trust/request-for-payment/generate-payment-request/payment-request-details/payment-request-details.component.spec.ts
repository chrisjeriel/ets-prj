import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestDetailsComponent } from './payment-request-details.component';

describe('PaymentRequestDetailsComponent', () => {
  let component: PaymentRequestDetailsComponent;
  let fixture: ComponentFixture<PaymentRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
