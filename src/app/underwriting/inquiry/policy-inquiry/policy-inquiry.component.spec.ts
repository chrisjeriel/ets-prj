import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyInquiryComponent } from './policy-inquiry.component';

describe('PolicyInquiryComponent', () => {
  let component: PolicyInquiryComponent;
  let fixture: ComponentFixture<PolicyInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
