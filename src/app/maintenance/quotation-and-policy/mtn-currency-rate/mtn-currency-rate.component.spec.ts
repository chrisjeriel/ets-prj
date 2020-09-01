import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCurrencyRateComponent } from './mtn-currency-rate.component';

describe('MtnCurrencyRateComponent', () => {
  let component: MtnCurrencyRateComponent;
  let fixture: ComponentFixture<MtnCurrencyRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCurrencyRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCurrencyRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
