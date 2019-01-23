import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingEntriesComponent } from './accounting-entries.component';

describe('AccountingEntriesComponent', () => {
  let component: AccountingEntriesComponent;
  let fixture: ComponentFixture<AccountingEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
