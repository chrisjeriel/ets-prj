import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvRegisterComponent } from './cv-register.component';

describe('CvRegisterComponent', () => {
  let component: CvRegisterComponent;
  let fixture: ComponentFixture<CvRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
