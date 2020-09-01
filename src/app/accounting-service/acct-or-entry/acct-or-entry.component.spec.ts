import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctOrEntryComponent } from './acct-or-entry.component';

describe('AcctOrEntryComponent', () => {
  let component: AcctOrEntryComponent;
  let fixture: ComponentFixture<AcctOrEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctOrEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctOrEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
