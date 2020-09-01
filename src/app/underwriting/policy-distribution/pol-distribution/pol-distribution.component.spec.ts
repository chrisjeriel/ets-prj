import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolDistributionComponent } from './pol-distribution.component';

describe('PolDistributionComponent', () => {
  let component: PolDistributionComponent;
  let fixture: ComponentFixture<PolDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
