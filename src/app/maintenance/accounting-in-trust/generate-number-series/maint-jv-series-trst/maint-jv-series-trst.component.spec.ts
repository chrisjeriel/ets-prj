import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintJvSeriesTrstComponent } from './maint-jv-series-trst.component';

describe('MaintJvSeriesTrstComponent', () => {
  let component: MaintJvSeriesTrstComponent;
  let fixture: ComponentFixture<MaintJvSeriesTrstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintJvSeriesTrstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintJvSeriesTrstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
