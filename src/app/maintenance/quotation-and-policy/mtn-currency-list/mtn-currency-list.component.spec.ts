import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCurrencyListComponent } from './mtn-currency-list.component';

describe('MtnCurrencyListComponent', () => {
  let component: MtnCurrencyListComponent;
  let fixture: ComponentFixture<MtnCurrencyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCurrencyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCurrencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
