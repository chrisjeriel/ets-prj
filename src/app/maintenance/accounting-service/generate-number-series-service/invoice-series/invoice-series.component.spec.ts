import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSeriesComponent } from './invoice-series.component';

describe('InvoiceSeriesComponent', () => {
  let component: InvoiceSeriesComponent;
  let fixture: ComponentFixture<InvoiceSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
