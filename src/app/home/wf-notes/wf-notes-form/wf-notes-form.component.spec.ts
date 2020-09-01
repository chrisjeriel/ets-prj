import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WfNotesFormComponent } from './wf-notes-form.component';

describe('WfNotesFormComponent', () => {
  let component: WfNotesFormComponent;
  let fixture: ComponentFixture<WfNotesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfNotesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfNotesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
