import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonEndTrialBalComponent } from './mon-end-trial-bal.component';

describe('MonEndTrialBalComponent', () => {
  let component: MonEndTrialBalComponent;
  let fixture: ComponentFixture<MonEndTrialBalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonEndTrialBalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonEndTrialBalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
