import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestsComponent } from './payment-requests.component';

describe('PaymentRequestsComponent', () => {
  let component: PaymentRequestsComponent;
  let fixture: ComponentFixture<PaymentRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
