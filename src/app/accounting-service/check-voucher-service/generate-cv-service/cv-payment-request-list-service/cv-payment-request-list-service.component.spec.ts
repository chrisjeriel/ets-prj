import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPaymentRequestListServiceComponent } from './cv-payment-request-list-service.component';

describe('CvPaymentRequestListServiceComponent', () => {
  let component: CvPaymentRequestListServiceComponent;
  let fixture: ComponentFixture<CvPaymentRequestListServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvPaymentRequestListServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPaymentRequestListServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
