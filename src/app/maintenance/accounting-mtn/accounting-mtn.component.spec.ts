import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingMtnComponent } from './accounting-mtn.component';

describe('AccountingMtnComponent', () => {
  let component: AccountingMtnComponent;
  let fixture: ComponentFixture<AccountingMtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingMtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingMtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
