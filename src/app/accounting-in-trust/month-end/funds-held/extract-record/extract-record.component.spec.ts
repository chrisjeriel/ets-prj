import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractRecordComponent } from './extract-record.component';

describe('ExtractRecordComponent', () => {
  let component: ExtractRecordComponent;
  let fixture: ComponentFixture<ExtractRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
