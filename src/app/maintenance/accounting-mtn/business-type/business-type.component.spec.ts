import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTypeComponent } from './business-type.component';

describe('BusinessTypeComponent', () => {
  let component: BusinessTypeComponent;
  let fixture: ComponentFixture<BusinessTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
