import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCurrencyCodeComponent } from './mtn-currency-code.component';

describe('MtnCurrencyCodeComponent', () => {
  let component: MtnCurrencyCodeComponent;
  let fixture: ComponentFixture<MtnCurrencyCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCurrencyCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCurrencyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
