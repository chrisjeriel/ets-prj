import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccSEditAccountingEntriesComponent } from './acc-s-edit-accounting-entries.component';

describe('AccSEditAccountingEntriesComponent', () => {
  let component: AccSEditAccountingEntriesComponent;
  let fixture: ComponentFixture<AccSEditAccountingEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccSEditAccountingEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccSEditAccountingEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
