import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvPreviewAmountDetailsComponent } from './jv-preview-amount-details.component';

describe('JvPreviewAmountDetailsComponent', () => {
  let component: JvPreviewAmountDetailsComponent;
  let fixture: ComponentFixture<JvPreviewAmountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvPreviewAmountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvPreviewAmountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
