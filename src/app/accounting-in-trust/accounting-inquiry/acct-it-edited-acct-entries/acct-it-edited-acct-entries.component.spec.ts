import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctItEditedAcctEntriesComponent } from './acct-it-edited-acct-entries.component';

describe('AcctItEditedAcctEntriesComponent', () => {
  let component: AcctItEditedAcctEntriesComponent;
  let fixture: ComponentFixture<AcctItEditedAcctEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctItEditedAcctEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctItEditedAcctEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
