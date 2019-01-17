import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvAttachmentComponent } from './cv-attachment.component';

describe('CvAttachmentComponent', () => {
  let component: CvAttachmentComponent;
  let fixture: ComponentFixture<CvAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
