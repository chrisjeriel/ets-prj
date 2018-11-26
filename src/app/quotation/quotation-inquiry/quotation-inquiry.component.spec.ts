import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationInquiryComponent } from './quotation-inquiry.component';

describe('QuotationInquiryComponent', () => {
  let component: QuotationInquiryComponent;
  let fixture: ComponentFixture<QuotationInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
