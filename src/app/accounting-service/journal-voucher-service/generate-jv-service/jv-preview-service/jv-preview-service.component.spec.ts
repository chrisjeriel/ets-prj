import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvPreviewServiceComponent } from './jv-preview-service.component';

describe('JvPreviewServiceComponent', () => {
  let component: JvPreviewServiceComponent;
  let fixture: ComponentFixture<JvPreviewServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvPreviewServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvPreviewServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
