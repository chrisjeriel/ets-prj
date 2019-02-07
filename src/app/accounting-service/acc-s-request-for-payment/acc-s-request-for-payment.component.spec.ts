import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccSRequestForPaymentComponent } from './acc-s-request-for-payment.component';

describe('AccSRequestForPaymentComponent', () => {
  let component: AccSRequestForPaymentComponent;
  let fixture: ComponentFixture<AccSRequestForPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccSRequestForPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccSRequestForPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
