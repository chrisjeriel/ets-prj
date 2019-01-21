import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelCvComponent } from './cancel-cv.component';

describe('CancelCvComponent', () => {
  let component: CancelCvComponent;
  let fixture: ComponentFixture<CancelCvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelCvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
