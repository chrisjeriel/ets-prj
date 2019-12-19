import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolDistributionCumComponent } from './pol-distribution-cum.component';

describe('PolDistributionCumComponent', () => {
  let component: PolDistributionCumComponent;
  let fixture: ComponentFixture<PolDistributionCumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolDistributionCumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolDistributionCumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
