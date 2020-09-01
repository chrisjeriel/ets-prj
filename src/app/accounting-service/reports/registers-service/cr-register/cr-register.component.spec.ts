import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrRegisterComponent } from './cr-register.component';

describe('CrRegisterComponent', () => {
  let component: CrRegisterComponent;
  let fixture: ComponentFixture<CrRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
