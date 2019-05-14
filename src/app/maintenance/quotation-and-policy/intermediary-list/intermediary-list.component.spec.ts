import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntermediaryListComponent } from './intermediary-list.component';

describe('IntermediaryListComponent', () => {
  let component: IntermediaryListComponent;
  let fixture: ComponentFixture<IntermediaryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntermediaryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntermediaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
