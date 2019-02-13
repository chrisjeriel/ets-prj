import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctUnbalanceEntriesComponent } from './acct-unbalance-entries.component';

describe('AcctUnbalanceEntriesComponent', () => {
  let component: AcctUnbalanceEntriesComponent;
  let fixture: ComponentFixture<AcctUnbalanceEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctUnbalanceEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctUnbalanceEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
