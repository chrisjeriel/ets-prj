import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCedingCompanyComponent } from './mtn-ceding-company.component';

describe('MtnCedingCompanyComponent', () => {
  let component: MtnCedingCompanyComponent;
  let fixture: ComponentFixture<MtnCedingCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCedingCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCedingCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
