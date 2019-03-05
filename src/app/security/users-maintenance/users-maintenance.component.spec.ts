import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersMaintenanceComponent } from './users-maintenance.component';

describe('UsersMaintenanceComponent', () => {
  let component: UsersMaintenanceComponent;
  let fixture: ComponentFixture<UsersMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
