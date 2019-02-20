import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArDetailsInvestmentIncomeComponent } from './ar-details-investment-income.component';

describe('ArDetailsInvestmentIncomeComponent', () => {
  let component: ArDetailsInvestmentIncomeComponent;
  let fixture: ComponentFixture<ArDetailsInvestmentIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArDetailsInvestmentIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArDetailsInvestmentIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
