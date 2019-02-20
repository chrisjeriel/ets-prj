import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchOrPrintingComponent } from './batch-or-printing.component';

describe('BatchOrPrintingComponent', () => {
  let component: BatchOrPrintingComponent;
  let fixture: ComponentFixture<BatchOrPrintingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchOrPrintingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchOrPrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
