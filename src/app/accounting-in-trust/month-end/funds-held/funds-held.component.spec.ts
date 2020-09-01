import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsHeldComponent } from './funds-held.component';

describe('FundsHeldComponent', () => {
  let component: FundsHeldComponent;
  let fixture: ComponentFixture<FundsHeldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundsHeldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsHeldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
