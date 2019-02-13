import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvAccountingEntriesComponent } from './jv-accounting-entries.component';

describe('JvAccountingEntriesComponent', () => {
  let component: JvAccountingEntriesComponent;
  let fixture: ComponentFixture<JvAccountingEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvAccountingEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvAccountingEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
