import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdmEntryComponent } from './cmdm-entry.component';

describe('CmdmEntryComponent', () => {
  let component: CmdmEntryComponent;
  let fixture: ComponentFixture<CmdmEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmdmEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdmEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
