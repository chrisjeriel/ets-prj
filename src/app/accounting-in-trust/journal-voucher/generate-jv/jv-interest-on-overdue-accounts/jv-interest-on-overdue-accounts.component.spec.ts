import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvInterestOnOverdueAccountsComponent } from './jv-interest-on-overdue-accounts.component';

describe('JvInterestOnOverdueAccountsComponent', () => {
  let component: JvInterestOnOverdueAccountsComponent;
  let fixture: ComponentFixture<JvInterestOnOverdueAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvInterestOnOverdueAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvInterestOnOverdueAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
