import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvAccEntriesComponent } from './cv-acc-entries.component';

describe('CvAccEntriesComponent', () => {
  let component: CvAccEntriesComponent;
  let fixture: ComponentFixture<CvAccEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvAccEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvAccEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
