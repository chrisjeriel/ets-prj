import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnAdjusterComponent } from './mtn-adjuster.component';

describe('MtnAdjusterComponent', () => {
  let component: MtnAdjusterComponent;
  let fixture: ComponentFixture<MtnAdjusterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnAdjusterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnAdjusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
