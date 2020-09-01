import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnProvinceComponent } from './mtn-province.component';

describe('MtnProvinceComponent', () => {
  let component: MtnProvinceComponent;
  let fixture: ComponentFixture<MtnProvinceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnProvinceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnProvinceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
