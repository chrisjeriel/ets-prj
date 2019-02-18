import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCurrencyComponent } from './mtn-currency.component';

describe('MtnCurrencyComponent', () => {
  let component: MtnCurrencyComponent;
  let fixture: ComponentFixture<MtnCurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
