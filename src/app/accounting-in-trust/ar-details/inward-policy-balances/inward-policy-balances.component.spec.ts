import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardPolicyBalancesComponent } from './inward-policy-balances.component';

describe('InwardPolicyBalancesComponent', () => {
  let component: InwardPolicyBalancesComponent;
  let fixture: ComponentFixture<InwardPolicyBalancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardPolicyBalancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardPolicyBalancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
