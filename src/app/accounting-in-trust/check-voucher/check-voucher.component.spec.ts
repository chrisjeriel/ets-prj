import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckVoucherComponent } from './check-voucher.component';

describe('CheckVoucherComponent', () => {
  let component: CheckVoucherComponent;
  let fixture: ComponentFixture<CheckVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
