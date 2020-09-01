import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnClmEventTypeLovComponent } from './mtn-clm-event-type-lov.component';

describe('MtnClmEventTypeLovComponent', () => {
  let component: MtnClmEventTypeLovComponent;
  let fixture: ComponentFixture<MtnClmEventTypeLovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnClmEventTypeLovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnClmEventTypeLovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
