import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidateAnnualTaxesWithheldComponent } from './consolidate-annual-taxes-withheld.component';

describe('ConsolidateAnnualTaxesWithheldComponent', () => {
  let component: ConsolidateAnnualTaxesWithheldComponent;
  let fixture: ComponentFixture<ConsolidateAnnualTaxesWithheldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidateAnnualTaxesWithheldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidateAnnualTaxesWithheldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
