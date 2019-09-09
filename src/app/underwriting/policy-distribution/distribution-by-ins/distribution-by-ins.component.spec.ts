import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionByInsComponent } from './distribution-by-ins.component';

describe('DistributionByInsComponent', () => {
  let component: DistributionByInsComponent;
  let fixture: ComponentFixture<DistributionByInsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionByInsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionByInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
