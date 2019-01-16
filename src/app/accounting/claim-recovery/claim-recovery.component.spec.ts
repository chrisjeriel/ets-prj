import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRecoveryComponent } from './claim-recovery.component';

describe('ClaimRecoveryComponent', () => {
  let component: ClaimRecoveryComponent;
  let fixture: ComponentFixture<ClaimRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
