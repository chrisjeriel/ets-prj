import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeToNewArComponent } from './change-to-new-ar.component';

describe('ChangeToNewArComponent', () => {
  let component: ChangeToNewArComponent;
  let fixture: ComponentFixture<ChangeToNewArComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeToNewArComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeToNewArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
