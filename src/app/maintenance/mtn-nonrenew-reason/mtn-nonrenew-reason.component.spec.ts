import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnNonrenewReasonComponent } from './mtn-nonrenew-reason.component';

describe('MtnNonrenewReasonComponent', () => {
  let component: MtnNonrenewReasonComponent;
  let fixture: ComponentFixture<MtnNonrenewReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnNonrenewReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnNonrenewReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
