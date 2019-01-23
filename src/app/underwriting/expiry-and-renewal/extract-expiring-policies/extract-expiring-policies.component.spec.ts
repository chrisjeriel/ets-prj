import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractExpiringPoliciesComponent } from './extract-expiring-policies.component';

describe('ExtractExpiringPoliciesComponent', () => {
  let component: ExtractExpiringPoliciesComponent;
  let fixture: ComponentFixture<ExtractExpiringPoliciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractExpiringPoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractExpiringPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
