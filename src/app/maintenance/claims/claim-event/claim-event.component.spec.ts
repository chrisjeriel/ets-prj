import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimEventComponent } from './claim-event.component';

describe('ClaimEventComponent', () => {
  let component: ClaimEventComponent;
  let fixture: ComponentFixture<ClaimEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
