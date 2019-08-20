import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvInvestmentPullOverComponent } from './jv-investment-pull-over.component';

describe('JvInvestmentPullOverComponent', () => {
  let component: JvInvestmentPullOverComponent;
  let fixture: ComponentFixture<JvInvestmentPullOverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvInvestmentPullOverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvInvestmentPullOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
