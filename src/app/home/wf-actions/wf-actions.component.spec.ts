import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WfActionsComponent } from './wf-actions.component';

describe('WfActionsComponent', () => {
  let component: WfActionsComponent;
  let fixture: ComponentFixture<WfActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
