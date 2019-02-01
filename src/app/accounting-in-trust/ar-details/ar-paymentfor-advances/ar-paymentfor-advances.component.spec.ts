import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArPaymentforAdvancesComponent } from './ar-paymentfor-advances.component';

describe('ArPaymentforAdvancesComponent', () => {
  let component: ArPaymentforAdvancesComponent;
  let fixture: ComponentFixture<ArPaymentforAdvancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArPaymentforAdvancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArPaymentforAdvancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
