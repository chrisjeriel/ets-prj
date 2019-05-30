import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionLineComponent } from './retention-line.component';

describe('RetentionLineComponent', () => {
  let component: RetentionLineComponent;
  let fixture: ComponentFixture<RetentionLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetentionLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
