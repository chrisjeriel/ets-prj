import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckVoucherServiceComponent } from './check-voucher-service.component';

describe('CheckVoucherServiceComponent', () => {
  let component: CheckVoucherServiceComponent;
  let fixture: ComponentFixture<CheckVoucherServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckVoucherServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckVoucherServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
