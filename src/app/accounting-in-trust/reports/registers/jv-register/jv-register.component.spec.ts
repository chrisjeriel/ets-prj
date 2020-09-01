import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvRegisterComponent } from './jv-register.component';

describe('JvRegisterComponent', () => {
  let component: JvRegisterComponent;
  let fixture: ComponentFixture<JvRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
