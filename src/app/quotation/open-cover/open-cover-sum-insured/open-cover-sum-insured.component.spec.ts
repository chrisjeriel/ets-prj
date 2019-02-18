import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCoverSumInsuredComponent } from './open-cover-sum-insured.component';

describe('OpenCoverSumInsuredComponent', () => {
  let component: OpenCoverSumInsuredComponent;
  let fixture: ComponentFixture<OpenCoverSumInsuredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenCoverSumInsuredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenCoverSumInsuredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
