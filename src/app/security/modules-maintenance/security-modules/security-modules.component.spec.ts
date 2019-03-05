import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityModulesComponent } from './security-modules.component';

describe('SecurityModulesComponent', () => {
  let component: SecurityModulesComponent;
  let fixture: ComponentFixture<SecurityModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
