import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeTrialBalProcComponent } from './me-trial-bal-proc.component';

describe('MeTrialBalProcComponent', () => {
  let component: MeTrialBalProcComponent;
  let fixture: ComponentFixture<MeTrialBalProcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeTrialBalProcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeTrialBalProcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
