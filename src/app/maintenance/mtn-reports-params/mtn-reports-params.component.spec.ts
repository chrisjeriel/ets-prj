import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnReportsParamsComponent } from './mtn-reports-params.component';

describe('MtnReportsParamsComponent', () => {
  let component: MtnReportsParamsComponent;
  let fixture: ComponentFixture<MtnReportsParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnReportsParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnReportsParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
