import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractBirTaxComponent } from './extract-bir-tax.component';

describe('ExtractBirTaxComponent', () => {
  let component: ExtractBirTaxComponent;
  let fixture: ComponentFixture<ExtractBirTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractBirTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractBirTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
