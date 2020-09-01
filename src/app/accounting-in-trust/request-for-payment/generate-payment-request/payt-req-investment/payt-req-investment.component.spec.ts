import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytReqInvestmentComponent } from './payt-req-investment.component';

describe('PaytReqInvestmentComponent', () => {
  let component: PaytReqInvestmentComponent;
  let fixture: ComponentFixture<PaytReqInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaytReqInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytReqInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
