import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenTaxesComponent } from './gen-taxes.component';

describe('GenTaxesComponent', () => {
  let component: GenTaxesComponent;
  let fixture: ComponentFixture<GenTaxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenTaxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
