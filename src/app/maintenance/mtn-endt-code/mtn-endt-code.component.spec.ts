import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnEndtCodeComponent } from './mtn-endt-code.component';

describe('MtnEndtCodeComponent', () => {
  let component: MtnEndtCodeComponent;
  let fixture: ComponentFixture<MtnEndtCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnEndtCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnEndtCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
