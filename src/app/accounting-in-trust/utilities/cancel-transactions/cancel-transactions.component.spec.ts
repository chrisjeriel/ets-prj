import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTransactionsComponent } from './cancel-transactions.component';

describe('CancelTransactionsComponent', () => {
  let component: CancelTransactionsComponent;
  let fixture: ComponentFixture<CancelTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
