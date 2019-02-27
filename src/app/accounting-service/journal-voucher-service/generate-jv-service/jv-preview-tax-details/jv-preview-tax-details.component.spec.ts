import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvPreviewTaxDetailsComponent } from './jv-preview-tax-details.component';

describe('JvPreviewTaxDetailsComponent', () => {
  let component: JvPreviewTaxDetailsComponent;
  let fixture: ComponentFixture<JvPreviewTaxDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvPreviewTaxDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvPreviewTaxDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
