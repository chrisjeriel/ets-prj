import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnInsuredComponent } from './mtn-insured.component';

describe('MtnInsuredComponent', () => {
  let component: MtnInsuredComponent;
  let fixture: ComponentFixture<MtnInsuredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnInsuredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnInsuredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
