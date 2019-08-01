import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCedingCompanyTreatyComponent } from './mtn-ceding-company-treaty.component';

describe('MtnCedingCompanyTreatyComponent', () => {
  let component: MtnCedingCompanyTreatyComponent;
  let fixture: ComponentFixture<MtnCedingCompanyTreatyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCedingCompanyTreatyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCedingCompanyTreatyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
