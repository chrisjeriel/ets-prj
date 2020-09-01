import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctTrialBalTbComponent } from './acct-trial-bal-tb.component';

describe('AcctTrialBalTbComponent', () => {
  let component: AcctTrialBalTbComponent;
  let fixture: ComponentFixture<AcctTrialBalTbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctTrialBalTbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctTrialBalTbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
