import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctSrvcCancelledTransactionsComponent } from './acct-srvc-cancelled-transactions.component';

describe('AcctSrvcCancelledTransactionsComponent', () => {
  let component: AcctSrvcCancelledTransactionsComponent;
  let fixture: ComponentFixture<AcctSrvcCancelledTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctSrvcCancelledTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctSrvcCancelledTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
