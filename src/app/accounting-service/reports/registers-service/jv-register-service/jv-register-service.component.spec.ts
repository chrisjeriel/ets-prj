import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvRegisterServiceComponent } from './jv-register-service.component';

describe('JvRegisterServiceComponent', () => {
  let component: JvRegisterServiceComponent;
  let fixture: ComponentFixture<JvRegisterServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvRegisterServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvRegisterServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
