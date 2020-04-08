import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchMoveBookingDateComponent } from './batch-move-booking-date.component';

describe('BatchMoveBookingDateComponent', () => {
  let component: BatchMoveBookingDateComponent;
  let fixture: ComponentFixture<BatchMoveBookingDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchMoveBookingDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchMoveBookingDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
