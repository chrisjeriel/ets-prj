import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdmAccntEntriesComponent } from './cmdm-accnt-entries.component';

describe('CmdmAccntEntriesComponent', () => {
  let component: CmdmAccntEntriesComponent;
  let fixture: ComponentFixture<CmdmAccntEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmdmAccntEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdmAccntEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
