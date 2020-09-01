import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArClaimCashCallComponent } from './ar-claim-cash-call.component';

describe('ArClaimCashCallComponent', () => {
  let component: ArClaimCashCallComponent;
  let fixture: ComponentFixture<ArClaimCashCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArClaimCashCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArClaimCashCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
