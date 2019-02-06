import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvPreviewServiceComponent } from './cv-preview-service.component';

describe('CvPreviewServiceComponent', () => {
  let component: CvPreviewServiceComponent;
  let fixture: ComponentFixture<CvPreviewServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvPreviewServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvPreviewServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
