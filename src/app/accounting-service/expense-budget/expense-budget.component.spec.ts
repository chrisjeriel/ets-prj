import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseBudgetComponent } from './expense-budget.component';

describe('ExpenseBudgetComponent', () => {
  let component: ExpenseBudgetComponent;
  let fixture: ComponentFixture<ExpenseBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
