import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchOsTakeupComponent } from './batch-os-takeup.component';

describe('BatchOsTakeupComponent', () => {
  let component: BatchOsTakeupComponent;
  let fixture: ComponentFixture<BatchOsTakeupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchOsTakeupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchOsTakeupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
