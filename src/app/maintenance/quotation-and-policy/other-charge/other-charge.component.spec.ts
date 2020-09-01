import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherChargeComponent } from './other-charge.component';

describe('OtherChargeComponent', () => {
  let component: OtherChargeComponent;
  let fixture: ComponentFixture<OtherChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
