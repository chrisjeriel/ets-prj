import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverrideLoginComponent } from './override-login.component';

describe('OverrideLoginComponent', () => {
  let component: OverrideLoginComponent;
  let fixture: ComponentFixture<OverrideLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverrideLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverrideLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
