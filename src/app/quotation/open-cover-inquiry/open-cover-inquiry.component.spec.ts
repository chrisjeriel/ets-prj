import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCoverInquiryComponent } from './open-cover-inquiry.component';

describe('OpenCoverInquiryComponent', () => {
  let component: OpenCoverInquiryComponent;
  let fixture: ComponentFixture<OpenCoverInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenCoverInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenCoverInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
