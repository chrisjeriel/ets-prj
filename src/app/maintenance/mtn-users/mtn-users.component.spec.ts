import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnUsersComponent } from './mtn-users.component';

describe('MtnUsersComponent', () => {
  let component: MtnUsersComponent;
  let fixture: ComponentFixture<MtnUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
