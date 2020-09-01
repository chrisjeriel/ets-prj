import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelArCvJvServiceComponent } from './cancel-ar-cv-jv-service.component';

describe('CancelArCvJvServiceComponent', () => {
  let component: CancelArCvJvServiceComponent;
  let fixture: ComponentFixture<CancelArCvJvServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelArCvJvServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelArCvJvServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
