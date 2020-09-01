import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InAccountingEntriesComponent } from './in-accounting-entries.component';

describe('InAccountingEntriesComponent', () => {
  let component: InAccountingEntriesComponent;
  let fixture: ComponentFixture<InAccountingEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InAccountingEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InAccountingEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
