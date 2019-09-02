import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvInvestmentPullOutComponent } from './jv-investment-pull-out.component';

describe('JvInvestmentPullOutComponent', () => {
  let component: JvInvestmentPullOutComponent;
  let fixture: ComponentFixture<JvInvestmentPullOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvInvestmentPullOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvInvestmentPullOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
