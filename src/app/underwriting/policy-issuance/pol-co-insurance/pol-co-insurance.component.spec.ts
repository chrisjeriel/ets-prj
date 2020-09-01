import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolCoInsuranceComponent } from './pol-co-insurance.component';

describe('PolCoInsuranceComponent', () => {
  let component: PolCoInsuranceComponent;
  let fixture: ComponentFixture<PolCoInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolCoInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolCoInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
