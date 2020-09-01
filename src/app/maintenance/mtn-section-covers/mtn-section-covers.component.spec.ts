import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnSectionCoversComponent } from './mtn-section-covers.component';

describe('MtnSectionCoversComponent', () => {
  let component: MtnSectionCoversComponent;
  let fixture: ComponentFixture<MtnSectionCoversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnSectionCoversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnSectionCoversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
