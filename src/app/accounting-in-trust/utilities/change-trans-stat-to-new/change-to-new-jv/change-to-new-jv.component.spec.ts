import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeToNewJvComponent } from './change-to-new-jv.component';

describe('ChangeToNewJvComponent', () => {
  let component: ChangeToNewJvComponent;
  let fixture: ComponentFixture<ChangeToNewJvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeToNewJvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeToNewJvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
