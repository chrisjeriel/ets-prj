import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LossResDepInqComponent } from './loss-res-dep-inq.component';

describe('LossResDepInqComponent', () => {
  let component: LossResDepInqComponent;
  let fixture: ComponentFixture<LossResDepInqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossResDepInqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossResDepInqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
