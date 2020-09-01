import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArClaimOverPaymentComponent } from './ar-claim-over-payment.component';

describe('ArClaimOverPaymentComponent', () => {
  let component: ArClaimOverPaymentComponent;
  let fixture: ComponentFixture<ArClaimOverPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArClaimOverPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArClaimOverPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
