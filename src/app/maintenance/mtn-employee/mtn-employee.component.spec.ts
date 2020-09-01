import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnEmployeeComponent } from './mtn-employee.component';

describe('MtnEmployeeComponent', () => {
  let component: MtnEmployeeComponent;
  let fixture: ComponentFixture<MtnEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
