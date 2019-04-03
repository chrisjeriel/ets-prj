import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolOcInquiryComponent } from './pol-oc-inquiry.component';

describe('PolOcInquiryComponent', () => {
  let component: PolOcInquiryComponent;
  let fixture: ComponentFixture<PolOcInquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolOcInquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolOcInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
