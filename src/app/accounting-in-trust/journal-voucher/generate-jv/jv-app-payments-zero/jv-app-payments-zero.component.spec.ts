import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvAppPaymentsZeroComponent } from './jv-app-payments-zero.component';

describe('JvAppPaymentsZeroComponent', () => {
  let component: JvAppPaymentsZeroComponent;
  let fixture: ComponentFixture<JvAppPaymentsZeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvAppPaymentsZeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvAppPaymentsZeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
