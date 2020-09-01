import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersServiceComponent } from './registers-service.component';

describe('RegistersServiceComponent', () => {
  let component: RegistersServiceComponent;
  let fixture: ComponentFixture<RegistersServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistersServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistersServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
