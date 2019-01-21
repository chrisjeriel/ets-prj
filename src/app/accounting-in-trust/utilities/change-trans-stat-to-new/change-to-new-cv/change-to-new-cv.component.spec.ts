import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeToNewCvComponent } from './change-to-new-cv.component';

describe('ChangeToNewCvComponent', () => {
  let component: ChangeToNewCvComponent;
  let fixture: ComponentFixture<ChangeToNewCvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeToNewCvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeToNewCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
