import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InTrustCreditDebitComponent } from './in-trust-credit-debit.component';

describe('InTrustCreditDebitComponent', () => {
  let component: InTrustCreditDebitComponent;
  let fixture: ComponentFixture<InTrustCreditDebitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InTrustCreditDebitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InTrustCreditDebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
