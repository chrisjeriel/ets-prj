import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolCoverageComponent } from './pol-coverage.component';

describe('PolCoverageComponent', () => {
  let component: PolCoverageComponent;
  let fixture: ComponentFixture<PolCoverageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolCoverageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
