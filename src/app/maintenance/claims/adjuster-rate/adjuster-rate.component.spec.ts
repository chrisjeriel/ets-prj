import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjusterRateComponent } from './adjuster-rate.component';

describe('AdjusterRateComponent', () => {
  let component: AdjusterRateComponent;
  let fixture: ComponentFixture<AdjusterRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjusterRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjusterRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
