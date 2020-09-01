import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WfRemindersComponent } from './wf-reminders.component';

describe('WfRemindersComponent', () => {
  let component: WfRemindersComponent;
  let fixture: ComponentFixture<WfRemindersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfRemindersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfRemindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
