import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolOtherRatesComponent } from './pol-other-rates.component';

describe('PolOtherRatesComponent', () => {
  let component: PolOtherRatesComponent;
  let fixture: ComponentFixture<PolOtherRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolOtherRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolOtherRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
