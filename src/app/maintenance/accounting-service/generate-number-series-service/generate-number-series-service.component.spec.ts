import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateNumberSeriesServiceComponent } from './generate-number-series-service.component';

describe('GenerateNumberSeriesServiceComponent', () => {
  let component: GenerateNumberSeriesServiceComponent;
  let fixture: ComponentFixture<GenerateNumberSeriesServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateNumberSeriesServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateNumberSeriesServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
