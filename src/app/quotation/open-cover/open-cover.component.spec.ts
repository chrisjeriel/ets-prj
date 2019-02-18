import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCoverComponent } from './open-cover.component';

describe('OpenCoverComponent', () => {
  let component: OpenCoverComponent;
  let fixture: ComponentFixture<OpenCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
