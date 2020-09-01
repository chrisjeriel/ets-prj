import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupsMaintenanceComponent } from './user-groups-maintenance.component';

describe('UserGroupsMaintenanceComponent', () => {
  let component: UserGroupsMaintenanceComponent;
  let fixture: ComponentFixture<UserGroupsMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGroupsMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupsMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
