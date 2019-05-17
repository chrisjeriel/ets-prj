import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolValueCoverageComponent } from './pol-value-coverage.component';

describe('PolValueCoverageComponent', () => {
  let component: PolValueCoverageComponent;
  let fixture: ComponentFixture<PolValueCoverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolValueCoverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolValueCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
