import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnTypeOfCessionComponent } from './mtn-type-of-cession.component';

describe('MtnTypeOfCessionComponent', () => {
  let component: MtnTypeOfCessionComponent;
  let fixture: ComponentFixture<MtnTypeOfCessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnTypeOfCessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnTypeOfCessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
