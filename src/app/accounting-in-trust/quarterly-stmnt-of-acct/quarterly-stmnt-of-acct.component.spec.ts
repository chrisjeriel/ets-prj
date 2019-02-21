import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterlyStmntOfAcctComponent } from './quarterly-stmnt-of-acct.component';

describe('QuarterlyStmntOfAcctComponent', () => {
  let component: QuarterlyStmntOfAcctComponent;
  let fixture: ComponentFixture<QuarterlyStmntOfAcctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuarterlyStmntOfAcctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuarterlyStmntOfAcctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
