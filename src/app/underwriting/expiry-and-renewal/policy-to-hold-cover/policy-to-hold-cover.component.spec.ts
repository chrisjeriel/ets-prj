import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyToHoldCoverComponent } from './policy-to-hold-cover.component';

describe('PolicyToHoldCoverComponent', () => {
  let component: PolicyToHoldCoverComponent;
  let fixture: ComponentFixture<PolicyToHoldCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyToHoldCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyToHoldCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
