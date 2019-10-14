import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvSeriesComponent } from './cv-series.component';

describe('CvSeriesComponent', () => {
  let component: CvSeriesComponent;
  let fixture: ComponentFixture<CvSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
