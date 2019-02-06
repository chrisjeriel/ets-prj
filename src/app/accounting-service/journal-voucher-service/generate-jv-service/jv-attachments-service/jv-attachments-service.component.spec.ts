import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvAttachmentsServiceComponent } from './jv-attachments-service.component';

describe('JvAttachmentsServiceComponent', () => {
  let component: JvAttachmentsServiceComponent;
  let fixture: ComponentFixture<JvAttachmentsServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvAttachmentsServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvAttachmentsServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
