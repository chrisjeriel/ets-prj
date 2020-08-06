import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremPlanComponent } from './prem-plan.component';

describe('PremPlanComponent', () => {
  let component: PremPlanComponent;
  let fixture: ComponentFixture<PremPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
