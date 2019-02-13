import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvRegisterServiceComponent } from './cv-register-service.component';

describe('CvRegisterServiceComponent', () => {
  let component: CvRegisterServiceComponent;
  let fixture: ComponentFixture<CvRegisterServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvRegisterServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvRegisterServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
