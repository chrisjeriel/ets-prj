import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelJvServiceComponent } from './cancel-jv-service.component';

describe('CancelJvServiceComponent', () => {
  let component: CancelJvServiceComponent;
  let fixture: ComponentFixture<CancelJvServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelJvServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelJvServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
