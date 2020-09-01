import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnApproverComponent } from './mtn-approver.component';

describe('MtnApproverComponent', () => {
  let component: MtnApproverComponent;
  let fixture: ComponentFixture<MtnApproverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnApproverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
