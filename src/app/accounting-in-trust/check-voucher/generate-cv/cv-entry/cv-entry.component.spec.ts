import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvEntryComponent } from './cv-entry.component';

describe('CvEntryComponent', () => {
  let component: CvEntryComponent;
  let fixture: ComponentFixture<CvEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
