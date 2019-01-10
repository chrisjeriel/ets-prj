import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolBatchProcessingComponent } from './pol-batch-processing.component';

describe('PolBatchProcessingComponent', () => {
  let component: PolBatchProcessingComponent;
  let fixture: ComponentFixture<PolBatchProcessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolBatchProcessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolBatchProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
