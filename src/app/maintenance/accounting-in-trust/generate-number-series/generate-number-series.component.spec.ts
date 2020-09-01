import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateNumberSeriesComponent } from './generate-number-series.component';

describe('GenerateNumberSeriesComponent', () => {
  let component: GenerateNumberSeriesComponent;
  let fixture: ComponentFixture<GenerateNumberSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateNumberSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateNumberSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
