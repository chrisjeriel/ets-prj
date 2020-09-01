import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctEntriesExtractComponent } from './acct-entries-extract.component';

describe('AcctEntriesExtractComponent', () => {
  let component: AcctEntriesExtractComponent;
  let fixture: ComponentFixture<AcctEntriesExtractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctEntriesExtractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctEntriesExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
