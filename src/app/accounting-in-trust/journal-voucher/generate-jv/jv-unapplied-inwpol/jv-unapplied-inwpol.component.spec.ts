import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvUnappliedInwpolComponent } from './jv-unapplied-inwpol.component';

describe('JvUnappliedInwpolComponent', () => {
  let component: JvUnappliedInwpolComponent;
  let fixture: ComponentFixture<JvUnappliedInwpolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvUnappliedInwpolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvUnappliedInwpolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
