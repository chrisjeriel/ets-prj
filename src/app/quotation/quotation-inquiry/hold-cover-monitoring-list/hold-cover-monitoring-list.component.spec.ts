import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldCoverMonitoringListComponent } from './hold-cover-monitoring-list.component';

describe('HoldCoverMonitoringListComponent', () => {
  let component: HoldCoverMonitoringListComponent;
  let fixture: ComponentFixture<HoldCoverMonitoringListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldCoverMonitoringListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldCoverMonitoringListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
