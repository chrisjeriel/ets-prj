import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvSeriesComponent } from './jv-series.component';

describe('JvSeriesComponent', () => {
  let component: JvSeriesComponent;
  let fixture: ComponentFixture<JvSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
