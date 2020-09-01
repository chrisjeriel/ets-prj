import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnClmEventComponent } from './mtn-clm-event.component';

describe('MtnClmEventComponent', () => {
  let component: MtnClmEventComponent;
  let fixture: ComponentFixture<MtnClmEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnClmEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnClmEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
