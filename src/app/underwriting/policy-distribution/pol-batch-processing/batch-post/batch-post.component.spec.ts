import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchPostComponent } from './batch-post.component';

describe('BatchPostComponent', () => {
  let component: BatchPostComponent;
  let fixture: ComponentFixture<BatchPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
