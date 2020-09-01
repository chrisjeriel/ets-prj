import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccountingEntriesComponent } from './edit-accounting-entries.component';

describe('EditAccountingEntriesComponent', () => {
  let component: EditAccountingEntriesComponent;
  let fixture: ComponentFixture<EditAccountingEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAccountingEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccountingEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
