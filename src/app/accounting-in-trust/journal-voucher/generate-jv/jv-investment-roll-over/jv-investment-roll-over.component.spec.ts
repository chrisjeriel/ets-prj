import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvInvestmentRollOverComponent } from './jv-investment-roll-over.component';

describe('JvInvestmentRollOverComponent', () => {
  let component: JvInvestmentRollOverComponent;
  let fixture: ComponentFixture<JvInvestmentRollOverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvInvestmentRollOverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvInvestmentRollOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
