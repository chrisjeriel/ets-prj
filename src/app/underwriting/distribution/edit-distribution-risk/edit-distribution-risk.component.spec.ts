import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDistributionRiskComponent } from './edit-distribution-risk.component';

describe('EditDistributionRiskComponent', () => {
  let component: EditDistributionRiskComponent;
  let fixture: ComponentFixture<EditDistributionRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDistributionRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDistributionRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
