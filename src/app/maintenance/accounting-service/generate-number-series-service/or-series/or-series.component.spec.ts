import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrSeriesComponent } from './or-series.component';

describe('OrSeriesComponent', () => {
  let component: OrSeriesComponent;
  let fixture: ComponentFixture<OrSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
