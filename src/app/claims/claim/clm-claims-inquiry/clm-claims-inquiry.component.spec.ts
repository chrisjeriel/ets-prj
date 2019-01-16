import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClmClaimsInquiryComponent } from './clm-claims-inquiry.component';

describe('ClmClaimsInquiryComponent', () => {
  let component: ClmClaimsInquiryComponent;
  let fixture: ComponentFixture<ClmClaimsInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClmClaimsInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClmClaimsInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
