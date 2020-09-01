import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnClmHistoryLovComponent } from './mtn-clm-history-lov.component';

describe('MtnClmHistoryLovComponent', () => {
  let component: MtnClmHistoryLovComponent;
  let fixture: ComponentFixture<MtnClmHistoryLovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnClmHistoryLovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnClmHistoryLovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
