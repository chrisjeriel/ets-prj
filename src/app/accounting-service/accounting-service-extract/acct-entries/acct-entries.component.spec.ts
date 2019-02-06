import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctEntriesComponent } from './acct-entries.component';

describe('AcctEntriesComponent', () => {
  let component: AcctEntriesComponent;
  let fixture: ComponentFixture<AcctEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
