import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForPaymentComponent } from './request-for-payment.component';

describe('RequestForPaymentComponent', () => {
  let component: RequestForPaymentComponent;
  let fixture: ComponentFixture<RequestForPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestForPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestForPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
