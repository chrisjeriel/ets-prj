import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnLossCdComponent } from './mtn-loss-cd.component';

describe('MtnLossCdComponent', () => {
  let component: MtnLossCdComponent;
  let fixture: ComponentFixture<MtnLossCdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnLossCdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnLossCdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
