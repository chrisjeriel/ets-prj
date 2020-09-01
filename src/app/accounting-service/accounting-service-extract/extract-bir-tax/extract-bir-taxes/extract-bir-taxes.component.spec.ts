import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractBirTaxesComponent } from './extract-bir-taxes.component';

describe('ExtractBirTaxesComponent', () => {
  let component: ExtractBirTaxesComponent;
  let fixture: ComponentFixture<ExtractBirTaxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractBirTaxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractBirTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
