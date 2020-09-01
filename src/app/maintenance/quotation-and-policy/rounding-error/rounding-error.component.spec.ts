import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundingErrorComponent } from './rounding-error.component';

describe('RoundingErrorComponent', () => {
  let component: RoundingErrorComponent;
  let fixture: ComponentFixture<RoundingErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundingErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundingErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
