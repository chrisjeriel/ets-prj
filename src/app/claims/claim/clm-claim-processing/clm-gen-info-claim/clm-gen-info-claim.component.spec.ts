import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClmGenInfoClaimComponent } from './clm-gen-info-claim.component';

describe('ClmGenInfoClaimComponent', () => {
  let component: ClmGenInfoClaimComponent;
  let fixture: ComponentFixture<ClmGenInfoClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClmGenInfoClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClmGenInfoClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
