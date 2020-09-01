import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvEntryServiceComponent } from './cv-entry-service.component';

describe('CvEntryServiceComponent', () => {
  let component: CvEntryServiceComponent;
  let fixture: ComponentFixture<CvEntryServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvEntryServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvEntryServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
