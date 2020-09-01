import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalVoucherServiceComponent } from './journal-voucher-service.component';

describe('JournalVoucherServiceComponent', () => {
  let component: JournalVoucherServiceComponent;
  let fixture: ComponentFixture<JournalVoucherServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalVoucherServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalVoucherServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
