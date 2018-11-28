import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldCoverComponent } from './hold-cover.component';

describe('HoldCoverComponent', () => {
  let component: HoldCoverComponent;
  let fixture: ComponentFixture<HoldCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
