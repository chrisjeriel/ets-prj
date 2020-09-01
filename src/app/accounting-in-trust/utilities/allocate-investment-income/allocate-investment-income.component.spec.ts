import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateInvestmentIncomeComponent } from './allocate-investment-income.component';

describe('AllocateInvestmentIncomeComponent', () => {
  let component: AllocateInvestmentIncomeComponent;
  let fixture: ComponentFixture<AllocateInvestmentIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateInvestmentIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateInvestmentIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
