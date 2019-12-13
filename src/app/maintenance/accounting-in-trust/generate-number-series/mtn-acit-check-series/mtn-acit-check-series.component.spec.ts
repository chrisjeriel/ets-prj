import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnAcitCheckSeriesComponent } from './mtn-acit-check-series.component';

describe('MtnAcitCheckSeriesComponent', () => {
  let component: MtnAcitCheckSeriesComponent;
  let fixture: ComponentFixture<MtnAcitCheckSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnAcitCheckSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnAcitCheckSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
