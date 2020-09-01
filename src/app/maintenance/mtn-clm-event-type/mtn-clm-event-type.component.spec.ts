import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnClmEventTypeComponent } from './mtn-clm-event-type.component';

describe('MtnClmEventTypeComponent', () => {
  let component: MtnClmEventTypeComponent;
  let fixture: ComponentFixture<MtnClmEventTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnClmEventTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnClmEventTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
