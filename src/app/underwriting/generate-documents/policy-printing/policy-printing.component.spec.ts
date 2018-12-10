import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyPrintingComponent } from './policy-printing.component';

describe('PolicyPrintingComponent', () => {
  let component: PolicyPrintingComponent;
  let fixture: ComponentFixture<PolicyPrintingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyPrintingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyPrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
