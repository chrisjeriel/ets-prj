import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationProcessingComponent } from './quotation-processing.component';

describe('QuotationProcessingComponent', () => {
  let component: QuotationProcessingComponent;
  let fixture: ComponentFixture<QuotationProcessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationProcessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
