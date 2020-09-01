import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonEndBatchComponent } from './mon-end-batch.component';

describe('MonEndBatchComponent', () => {
  let component: MonEndBatchComponent;
  let fixture: ComponentFixture<MonEndBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonEndBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonEndBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
