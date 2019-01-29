import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArLossReserveDepositComponent } from './ar-loss-reserve-deposit.component';

describe('ArLossReserveDepositComponent', () => {
  let component: ArLossReserveDepositComponent;
  let fixture: ComponentFixture<ArLossReserveDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArLossReserveDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArLossReserveDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
