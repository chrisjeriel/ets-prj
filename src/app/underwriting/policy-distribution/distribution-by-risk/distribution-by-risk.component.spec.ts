import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionByRiskComponent } from './distribution-by-risk.component';

describe('DistributionByRiskComponent', () => {
  let component: DistributionByRiskComponent;
  let fixture: ComponentFixture<DistributionByRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionByRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionByRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
