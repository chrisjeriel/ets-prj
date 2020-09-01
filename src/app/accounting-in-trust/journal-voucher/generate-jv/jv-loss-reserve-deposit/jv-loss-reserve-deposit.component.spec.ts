import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvLossReserveDepositComponent } from './jv-loss-reserve-deposit.component';

describe('JvLossReserveDepositComponent', () => {
  let component: JvLossReserveDepositComponent;
  let fixture: ComponentFixture<JvLossReserveDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvLossReserveDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvLossReserveDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
