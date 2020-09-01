import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctTrialBalExtractComponent } from './acct-trial-bal-extract.component';

describe('AcctTrialBalExtractComponent', () => {
  let component: AcctTrialBalExtractComponent;
  let fixture: ComponentFixture<AcctTrialBalExtractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctTrialBalExtractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctTrialBalExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
