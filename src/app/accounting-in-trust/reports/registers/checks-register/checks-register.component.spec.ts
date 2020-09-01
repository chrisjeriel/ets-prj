import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecksRegisterComponent } from './checks-register.component';

describe('ChecksRegisterComponent', () => {
  let component: ChecksRegisterComponent;
  let fixture: ComponentFixture<ChecksRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecksRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecksRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
