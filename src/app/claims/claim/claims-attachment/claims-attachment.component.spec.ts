import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsAttachmentComponent } from './claims-attachment.component';

describe('ClaimsAttachmentComponent', () => {
  let component: ClaimsAttachmentComponent;
  let fixture: ComponentFixture<ClaimsAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
