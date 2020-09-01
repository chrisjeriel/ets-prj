import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctOrOfficialReceiptComponent } from './acct-or-official-receipt.component';

describe('AcctOrOfficialReceiptComponent', () => {
  let component: AcctOrOfficialReceiptComponent;
  let fixture: ComponentFixture<AcctOrOfficialReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctOrOfficialReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctOrOfficialReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
