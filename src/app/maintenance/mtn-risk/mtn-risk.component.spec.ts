import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnRiskComponent } from './mtn-risk.component';

describe('MtnRiskComponent', () => {
  let component: MtnRiskComponent;
  let fixture: ComponentFixture<MtnRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
