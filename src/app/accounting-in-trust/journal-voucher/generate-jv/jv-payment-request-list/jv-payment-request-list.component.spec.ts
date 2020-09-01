import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvPaymentRequestListComponent } from './jv-payment-request-list.component';

describe('JvPaymentRequestListComponent', () => {
  let component: JvPaymentRequestListComponent;
  let fixture: ComponentFixture<JvPaymentRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvPaymentRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvPaymentRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
