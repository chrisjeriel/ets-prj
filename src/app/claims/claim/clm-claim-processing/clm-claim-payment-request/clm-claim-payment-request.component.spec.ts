import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClmClaimPaymentRequestComponent } from './clm-claim-payment-request.component';

describe('ClmClaimPaymentRequestComponent', () => {
  let component: ClmClaimPaymentRequestComponent;
  let fixture: ComponentFixture<ClmClaimPaymentRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClmClaimPaymentRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClmClaimPaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
