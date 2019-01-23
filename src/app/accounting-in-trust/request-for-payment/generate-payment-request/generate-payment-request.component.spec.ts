import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePaymentRequestComponent } from './generate-payment-request.component';

describe('GeneratePaymentRequestComponent', () => {
  let component: GeneratePaymentRequestComponent;
  let fixture: ComponentFixture<GeneratePaymentRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratePaymentRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratePaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
