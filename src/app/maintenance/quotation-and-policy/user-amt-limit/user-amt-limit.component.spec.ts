import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAmtLimitComponent } from './user-amt-limit.component';

describe('UserAmtLimitComponent', () => {
  let component: UserAmtLimitComponent;
  let fixture: ComponentFixture<UserAmtLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAmtLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAmtLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
