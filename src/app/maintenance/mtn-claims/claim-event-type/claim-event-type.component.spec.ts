import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimEventTypeComponent } from './claim-event-type.component';

describe('ClaimEventTypeComponent', () => {
  let component: ClaimEventTypeComponent;
  let fixture: ComponentFixture<ClaimEventTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimEventTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimEventTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
