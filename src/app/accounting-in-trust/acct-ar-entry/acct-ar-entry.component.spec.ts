import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctArEntryComponent } from './acct-ar-entry.component';

describe('AcctArEntryComponent', () => {
  let component: AcctArEntryComponent;
  let fixture: ComponentFixture<AcctArEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctArEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctArEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
