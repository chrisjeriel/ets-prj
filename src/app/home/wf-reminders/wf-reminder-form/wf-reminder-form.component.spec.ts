import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WfReminderFormComponent } from './wf-reminder-form.component';

describe('WfReminderFormComponent', () => {
  let component: WfReminderFormComponent;
  let fixture: ComponentFixture<WfReminderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfReminderFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfReminderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
