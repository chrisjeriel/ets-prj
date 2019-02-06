import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentOcComponent } from './attachment-oc.component';

describe('AttachmentOcComponent', () => {
  let component: AttachmentOcComponent;
  let fixture: ComponentFixture<AttachmentOcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentOcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentOcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
