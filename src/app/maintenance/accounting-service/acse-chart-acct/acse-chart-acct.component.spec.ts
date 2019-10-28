import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcseChartAcctComponent } from './acse-chart-acct.component';

describe('AcseChartAcctComponent', () => {
  let component: AcseChartAcctComponent;
  let fixture: ComponentFixture<AcseChartAcctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcseChartAcctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcseChartAcctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
