import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnAcseCheckSeriesComponent } from './mtn-acse-check-series.component';

describe('MtnAcseCheckSeriesComponent', () => {
  let component: MtnAcseCheckSeriesComponent;
  let fixture: ComponentFixture<MtnAcseCheckSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnAcseCheckSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnAcseCheckSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
