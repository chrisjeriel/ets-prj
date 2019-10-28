import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchDistComponent } from './batch-dist.component';

describe('BatchDistComponent', () => {
  let component: BatchDistComponent;
  let fixture: ComponentFixture<BatchDistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchDistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchDistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
