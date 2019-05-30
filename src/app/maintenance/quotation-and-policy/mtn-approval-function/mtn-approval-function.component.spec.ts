import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnApprovalFunctionComponent } from './mtn-approval-function.component';

describe('MtnApprovalFunctionComponent', () => {
  let component: MtnApprovalFunctionComponent;
  let fixture: ComponentFixture<MtnApprovalFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnApprovalFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnApprovalFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
