import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnIntermediaryComponent } from './mtn-intermediary.component';

describe('MtnIntermediaryComponent', () => {
  let component: MtnIntermediaryComponent;
  let fixture: ComponentFixture<MtnIntermediaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnIntermediaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnIntermediaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
