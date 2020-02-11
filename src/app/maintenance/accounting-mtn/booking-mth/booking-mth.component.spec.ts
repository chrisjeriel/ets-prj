import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingMthComponent } from './booking-mth.component';

describe('BookingMthComponent', () => {
  let component: BookingMthComponent;
  let fixture: ComponentFixture<BookingMthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingMthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingMthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
