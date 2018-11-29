import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustEditableNonDatatableTableComponent } from './cust-editable-non-datatable-table.component';

describe('CustEditableNonDatatableTableComponent', () => {
  let component: CustEditableNonDatatableTableComponent;
  let fixture: ComponentFixture<CustEditableNonDatatableTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustEditableNonDatatableTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustEditableNonDatatableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
