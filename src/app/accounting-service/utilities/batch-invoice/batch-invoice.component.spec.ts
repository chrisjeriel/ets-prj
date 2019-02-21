import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchInvoiceComponent } from './batch-invoice.component';

describe('BatchInvoiceComponent', () => {
  let component: BatchInvoiceComponent;
  let fixture: ComponentFixture<BatchInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
