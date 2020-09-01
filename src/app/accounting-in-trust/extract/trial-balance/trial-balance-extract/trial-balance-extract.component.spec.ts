import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialBalanceExtractComponent } from './trial-balance-extract.component';

describe('TrialBalanceExtractComponent', () => {
  let component: TrialBalanceExtractComponent;
  let fixture: ComponentFixture<TrialBalanceExtractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialBalanceExtractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialBalanceExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
