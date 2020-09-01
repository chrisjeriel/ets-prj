import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCityComponent } from './mtn-city.component';

describe('MtnCityComponent', () => {
  let component: MtnCityComponent;
  let fixture: ComponentFixture<MtnCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
