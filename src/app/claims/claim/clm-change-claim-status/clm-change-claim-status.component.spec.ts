import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClmChangeClaimStatusComponent } from './clm-change-claim-status.component';

describe('ClmChangeClaimStatusComponent', () => {
  let component: ClmChangeClaimStatusComponent;
  let fixture: ComponentFixture<ClmChangeClaimStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClmChangeClaimStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClmChangeClaimStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
