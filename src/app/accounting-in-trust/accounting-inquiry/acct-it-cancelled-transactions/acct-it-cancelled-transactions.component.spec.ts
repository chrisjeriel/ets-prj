import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctItCancelledTransactionsComponent } from './acct-it-cancelled-transactions.component';

describe('AcctItCancelledTransactionsComponent', () => {
  let component: AcctItCancelledTransactionsComponent;
  let fixture: ComponentFixture<AcctItCancelledTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctItCancelledTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctItCancelledTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
