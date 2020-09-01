import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolAttachmentComponent } from './pol-attachment.component';

describe('PolAttachmentComponent', () => {
  let component: PolAttachmentComponent;
  let fixture: ComponentFixture<PolAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
