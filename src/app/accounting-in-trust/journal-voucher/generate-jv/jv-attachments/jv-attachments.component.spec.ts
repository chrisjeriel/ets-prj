import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvAttachmentsComponent } from './jv-attachments.component';

describe('JvAttachmentsComponent', () => {
  let component: JvAttachmentsComponent;
  let fixture: ComponentFixture<JvAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
