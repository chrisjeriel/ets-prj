import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCedingCompanyMemberComponent } from './mtn-ceding-company-member.component';

describe('MtnCedingCompanyMemberComponent', () => {
  let component: MtnCedingCompanyMemberComponent;
  let fixture: ComponentFixture<MtnCedingCompanyMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCedingCompanyMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCedingCompanyMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
