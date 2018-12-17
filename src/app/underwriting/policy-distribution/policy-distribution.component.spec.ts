import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDistributionComponent } from './policy-distribution.component';

describe('PolicyDistributionComponent', () => {
  let component: PolicyDistributionComponent;
  let fixture: ComponentFixture<PolicyDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
