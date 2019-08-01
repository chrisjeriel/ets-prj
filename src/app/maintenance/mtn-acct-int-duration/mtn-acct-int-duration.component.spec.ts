import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnAcctIntDurationComponent } from './mtn-acct-int-duration.component';

describe('MtnAcctIntDurationComponent', () => {
  let component: MtnAcctIntDurationComponent;
  let fixture: ComponentFixture<MtnAcctIntDurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnAcctIntDurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnAcctIntDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
