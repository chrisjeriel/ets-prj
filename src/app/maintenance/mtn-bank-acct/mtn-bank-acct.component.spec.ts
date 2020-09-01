import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnBankAcctComponent } from './mtn-bank-acct.component';

describe('MtnBankAcctComponent', () => {
  let component: MtnBankAcctComponent;
  let fixture: ComponentFixture<MtnBankAcctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnBankAcctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnBankAcctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
