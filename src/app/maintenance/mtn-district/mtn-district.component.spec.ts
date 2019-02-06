import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnDistrictComponent } from './mtn-district.component';

describe('MtnDistrictComponent', () => {
  let component: MtnDistrictComponent;
  let fixture: ComponentFixture<MtnDistrictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnDistrictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnDistrictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
