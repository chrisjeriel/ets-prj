import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecksRegisterServiceComponent } from './checks-register-service.component';

describe('ChecksRegisterServiceComponent', () => {
  let component: ChecksRegisterServiceComponent;
  let fixture: ComponentFixture<ChecksRegisterServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecksRegisterServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecksRegisterServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
