import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitCommissionComponent } from './profit-commission.component';

describe('ProfitCommissionComponent', () => {
  let component: ProfitCommissionComponent;
  let fixture: ComponentFixture<ProfitCommissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfitCommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
