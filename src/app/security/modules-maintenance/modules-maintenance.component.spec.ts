import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesMaintenanceComponent } from './modules-maintenance.component';

describe('ModulesMaintenanceComponent', () => {
  let component: ModulesMaintenanceComponent;
  let fixture: ComponentFixture<ModulesMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulesMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulesMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
