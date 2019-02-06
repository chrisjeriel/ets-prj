import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvAttachmentsServiceComponent } from './cv-attachments-service.component';

describe('CvAttachmentsServiceComponent', () => {
  let component: CvAttachmentsServiceComponent;
  let fixture: ComponentFixture<CvAttachmentsServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvAttachmentsServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvAttachmentsServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
