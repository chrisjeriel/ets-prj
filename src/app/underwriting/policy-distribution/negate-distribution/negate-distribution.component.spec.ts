import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegateDistributionComponent } from './negate-distribution.component';

describe('NegateDistributionComponent', () => {
  let component: NegateDistributionComponent;
  let fixture: ComponentFixture<NegateDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegateDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegateDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
