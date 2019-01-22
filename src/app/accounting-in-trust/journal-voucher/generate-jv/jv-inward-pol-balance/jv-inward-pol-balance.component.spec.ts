import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvInwardPolBalanceComponent } from './jv-inward-pol-balance.component';

describe('JvInwardPolBalanceComponent', () => {
  let component: JvInwardPolBalanceComponent;
  let fixture: ComponentFixture<JvInwardPolBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvInwardPolBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvInwardPolBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
