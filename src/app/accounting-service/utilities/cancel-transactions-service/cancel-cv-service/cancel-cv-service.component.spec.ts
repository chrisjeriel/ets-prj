import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelCvServiceComponent } from './cancel-cv-service.component';

describe('CancelCvServiceComponent', () => {
  let component: CancelCvServiceComponent;
  let fixture: ComponentFixture<CancelCvServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelCvServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelCvServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
