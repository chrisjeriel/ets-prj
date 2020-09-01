import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintCvSeriesTrstComponent } from './maint-cv-series-trst.component';

describe('MaintCvSeriesTrstComponent', () => {
  let component: MaintCvSeriesTrstComponent;
  let fixture: ComponentFixture<MaintCvSeriesTrstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintCvSeriesTrstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintCvSeriesTrstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
