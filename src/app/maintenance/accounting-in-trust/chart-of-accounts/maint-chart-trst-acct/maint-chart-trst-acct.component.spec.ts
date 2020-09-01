import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintChartTrstAcctComponent } from './maint-chart-trst-acct.component';

describe('MaintChartTrstAcctComponent', () => {
  let component: MaintChartTrstAcctComponent;
  let fixture: ComponentFixture<MaintChartTrstAcctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintChartTrstAcctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintChartTrstAcctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
