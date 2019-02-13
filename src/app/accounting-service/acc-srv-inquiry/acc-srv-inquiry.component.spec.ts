import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccSrvInquiryComponent } from './acc-srv-inquiry.component';

describe('AccSrvInquiryComponent', () => {
  let component: AccSrvInquiryComponent;
  let fixture: ComponentFixture<AccSrvInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccSrvInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccSrvInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
