import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePolAttachmentComponent } from './update-pol-attachment.component';

describe('UpdatePolAttachmentComponent', () => {
  let component: UpdatePolAttachmentComponent;
  let fixture: ComponentFixture<UpdatePolAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePolAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePolAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
