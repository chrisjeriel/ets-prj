import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccSEditedAccountingEntriesComponent } from './acc-s-edited-accounting-entries.component';

describe('AccSEditedAccountingEntriesComponent', () => {
  let component: AccSEditedAccountingEntriesComponent;
  let fixture: ComponentFixture<AccSEditedAccountingEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccSEditedAccountingEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccSEditedAccountingEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
