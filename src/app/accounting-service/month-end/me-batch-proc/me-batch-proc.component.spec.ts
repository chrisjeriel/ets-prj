import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeBatchProcComponent } from './me-batch-proc.component';

describe('MeBatchProcComponent', () => {
  let component: MeBatchProcComponent;
  let fixture: ComponentFixture<MeBatchProcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeBatchProcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeBatchProcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
