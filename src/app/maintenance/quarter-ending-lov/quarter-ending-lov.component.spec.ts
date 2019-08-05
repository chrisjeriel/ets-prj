import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterEndingLovComponent } from './quarter-ending-lov.component';

describe('QuarterEndingLovComponent', () => {
  let component: QuarterEndingLovComponent;
  let fixture: ComponentFixture<QuarterEndingLovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuarterEndingLovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuarterEndingLovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
