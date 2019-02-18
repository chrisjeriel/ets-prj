import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCoverProcessingComponent } from './open-cover-processing.component';

describe('OpenCoverProcessingComponent', () => {
  let component: OpenCoverProcessingComponent;
  let fixture: ComponentFixture<OpenCoverProcessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenCoverProcessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenCoverProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
