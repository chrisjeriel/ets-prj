import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccAttachmentsComponent } from './acc-attachments.component';

describe('AccAttachmentsComponent', () => {
  let component: AccAttachmentsComponent;
  let fixture: ComponentFixture<AccAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccAttachmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
