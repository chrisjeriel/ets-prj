import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WfNotesComponent } from './wf-notes.component';

describe('WfNotesComponent', () => {
  let component: WfNotesComponent;
  let fixture: ComponentFixture<WfNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
