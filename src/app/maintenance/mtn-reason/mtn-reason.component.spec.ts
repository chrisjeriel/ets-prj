import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnReasonComponent } from './mtn-reason.component';

describe('MtnReasonComponent', () => {
  let component: MtnReasonComponent;
  let fixture: ComponentFixture<MtnReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
