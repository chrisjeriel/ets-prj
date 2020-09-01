import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvPreniumReserveComponent } from './jv-prenium-reserve.component';

describe('JvPreniumReserveComponent', () => {
  let component: JvPreniumReserveComponent;
  let fixture: ComponentFixture<JvPreniumReserveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvPreniumReserveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvPreniumReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
