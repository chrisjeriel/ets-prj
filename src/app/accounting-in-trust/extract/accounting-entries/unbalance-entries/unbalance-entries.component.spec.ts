import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnbalanceEntriesComponent } from './unbalance-entries.component';

describe('UnbalanceEntriesComponent', () => {
  let component: UnbalanceEntriesComponent;
  let fixture: ComponentFixture<UnbalanceEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnbalanceEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnbalanceEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
