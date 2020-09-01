import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintModalMtnAcctComponent } from './print-modal-mtn-acct.component';

describe('PrintModalMtnAcctComponent', () => {
  let component: PrintModalMtnAcctComponent;
  let fixture: ComponentFixture<PrintModalMtnAcctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintModalMtnAcctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintModalMtnAcctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
