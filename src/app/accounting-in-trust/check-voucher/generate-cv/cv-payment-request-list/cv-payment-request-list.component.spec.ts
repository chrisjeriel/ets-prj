import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPaymentRequestListComponent } from './cv-payment-request-list.component';

describe('CvPaymentRequestListComponent', () => {
  let component: CvPaymentRequestListComponent;
  let fixture: ComponentFixture<CvPaymentRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvPaymentRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPaymentRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
