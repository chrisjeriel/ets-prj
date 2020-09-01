import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardPolBalanceComponent } from './inward-pol-balance.component';

describe('InwardPolBalanceComponent', () => {
  let component: InwardPolBalanceComponent;
  let fixture: ComponentFixture<InwardPolBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardPolBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardPolBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
