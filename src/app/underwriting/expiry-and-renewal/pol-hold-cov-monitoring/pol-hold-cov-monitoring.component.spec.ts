import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolHoldCovMonitoringComponent } from './pol-hold-cov-monitoring.component';

describe('PolHoldCovMonitoringComponent', () => {
  let component: PolHoldCovMonitoringComponent;
  let fixture: ComponentFixture<PolHoldCovMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolHoldCovMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolHoldCovMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
