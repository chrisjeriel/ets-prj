import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestEntryComponent } from './payment-request-entry.component';

describe('PaymentRequestEntryComponent', () => {
  let component: PaymentRequestEntryComponent;
  let fixture: ComponentFixture<PaymentRequestEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentRequestEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentRequestEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
