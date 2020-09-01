import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctCmdmEntryComponent } from './acct-cmdm-entry.component';

describe('AcctCmdmEntryComponent', () => {
  let component: AcctCmdmEntryComponent;
  let fixture: ComponentFixture<AcctCmdmEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctCmdmEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctCmdmEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
