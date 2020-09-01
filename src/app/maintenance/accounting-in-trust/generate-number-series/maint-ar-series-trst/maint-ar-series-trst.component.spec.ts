import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintArSeriesTrstComponent } from './maint-ar-series-trst.component';

describe('MaintArSeriesTrstComponent', () => {
  let component: MaintArSeriesTrstComponent;
  let fixture: ComponentFixture<MaintArSeriesTrstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintArSeriesTrstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintArSeriesTrstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
