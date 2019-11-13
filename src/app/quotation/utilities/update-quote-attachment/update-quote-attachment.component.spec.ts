import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuoteAttachmentComponent } from './update-quote-attachment.component';

describe('UpdateQuoteAttachmentComponent', () => {
  let component: UpdateQuoteAttachmentComponent;
  let fixture: ComponentFixture<UpdateQuoteAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateQuoteAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateQuoteAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
