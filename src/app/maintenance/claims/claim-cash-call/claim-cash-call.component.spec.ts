import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimCashCallComponent } from './claim-cash-call.component';

describe('ClaimCashCallComponent', () => {
  let component: ClaimCashCallComponent;
  let fixture: ComponentFixture<ClaimCashCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimCashCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimCashCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
