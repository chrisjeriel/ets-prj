import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvInvestmentPlacementComponent } from './jv-investment-placement.component';

describe('JvInvestmentPlacementComponent', () => {
  let component: JvInvestmentPlacementComponent;
  let fixture: ComponentFixture<JvInvestmentPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvInvestmentPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvInvestmentPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
