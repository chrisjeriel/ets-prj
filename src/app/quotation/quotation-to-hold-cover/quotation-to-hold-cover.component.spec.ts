import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationToHoldCoverComponent } from './quotation-to-hold-cover.component';

describe('QuotationToHoldCoverComponent', () => {
  let component: QuotationToHoldCoverComponent;
  let fixture: ComponentFixture<QuotationToHoldCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationToHoldCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationToHoldCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
