import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctSrvcAnnualDetailsComponent } from './acct-srvc-annual-details.component';

describe('AcctSrvcAnnualDetailsComponent', () => {
  let component: AcctSrvcAnnualDetailsComponent;
  let fixture: ComponentFixture<AcctSrvcAnnualDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctSrvcAnnualDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctSrvcAnnualDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
