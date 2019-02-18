import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctUploadComponent } from './acct-upload.component';

describe('AcctUploadComponent', () => {
  let component: AcctUploadComponent;
  let fixture: ComponentFixture<AcctUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
