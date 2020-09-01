import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialBalanceTbComponent } from './trial-balance-tb.component';

describe('TrialBalanceTbComponent', () => {
  let component: TrialBalanceTbComponent;
  let fixture: ComponentFixture<TrialBalanceTbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialBalanceTbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialBalanceTbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
