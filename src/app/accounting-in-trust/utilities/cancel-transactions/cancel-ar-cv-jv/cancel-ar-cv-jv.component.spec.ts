import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelArCvJvComponent } from './cancel-ar-cv-jv.component';

describe('CancelArCvJvComponent', () => {
  let component: CancelArCvJvComponent;
  let fixture: ComponentFixture<CancelArCvJvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelArCvJvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelArCvJvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
