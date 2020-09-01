import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctSrvcConsolidateDataComponent } from './acct-srvc-consolidate-data.component';

describe('AcctSrvcConsolidateDataComponent', () => {
  let component: AcctSrvcConsolidateDataComponent;
  let fixture: ComponentFixture<AcctSrvcConsolidateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctSrvcConsolidateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctSrvcConsolidateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
