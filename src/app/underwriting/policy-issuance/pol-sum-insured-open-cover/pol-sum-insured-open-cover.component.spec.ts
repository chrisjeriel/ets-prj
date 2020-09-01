import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolSumInsuredOpenCoverComponent } from './pol-sum-insured-open-cover.component';

describe('PolSumInsuredOpenCoverComponent', () => {
  let component: PolSumInsuredOpenCoverComponent;
  let fixture: ComponentFixture<PolSumInsuredOpenCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolSumInsuredOpenCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolSumInsuredOpenCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
