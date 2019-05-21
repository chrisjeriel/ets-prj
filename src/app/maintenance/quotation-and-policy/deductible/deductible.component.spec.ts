import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductibleComponent } from './deductible.component';

describe('DeductibleComponent', () => {
  let component: DeductibleComponent;
  let fixture: ComponentFixture<DeductibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeductibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
