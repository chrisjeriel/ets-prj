import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClmClaimHistoryComponent } from './clm-claim-history.component';

describe('ClmClaimHistoryComponent', () => {
  let component: ClmClaimHistoryComponent;
  let fixture: ComponentFixture<ClmClaimHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClmClaimHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClmClaimHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
