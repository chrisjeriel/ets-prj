import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CedingCompanyComponent } from './ceding-company.component';

describe('CedingCompanyComponent', () => {
  let component: CedingCompanyComponent;
  let fixture: ComponentFixture<CedingCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CedingCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CedingCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
