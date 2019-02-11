import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctTrialBalComponent } from './acct-trial-bal.component';

describe('AcctTrialBalComponent', () => {
  let component: AcctTrialBalComponent;
  let fixture: ComponentFixture<AcctTrialBalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctTrialBalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctTrialBalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
