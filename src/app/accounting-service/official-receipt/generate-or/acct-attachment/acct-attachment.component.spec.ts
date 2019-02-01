import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctAttachmentComponent } from './acct-attachment.component';

describe('AcctAttachmentComponent', () => {
  let component: AcctAttachmentComponent;
  let fixture: ComponentFixture<AcctAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
