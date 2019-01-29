import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArDetailsInvestmentsComponent } from './ar-details-investments.component';

describe('ArDetailsInvestmentsComponent', () => {
  let component: ArDetailsInvestmentsComponent;
  let fixture: ComponentFixture<ArDetailsInvestmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArDetailsInvestmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArDetailsInvestmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
