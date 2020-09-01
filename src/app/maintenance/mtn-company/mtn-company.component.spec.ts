import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCompanyComponent } from './mtn-company.component';

describe('MtnCompanyComponent', () => {
  let component: MtnCompanyComponent;
  let fixture: ComponentFixture<MtnCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
