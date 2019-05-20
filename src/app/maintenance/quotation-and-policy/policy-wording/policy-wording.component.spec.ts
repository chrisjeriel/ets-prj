import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyWordingComponent } from './policy-wording.component';

describe('PolicyWordingComponent', () => {
  let component: PolicyWordingComponent;
  let fixture: ComponentFixture<PolicyWordingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyWordingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyWordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
