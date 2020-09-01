import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClmSectionCoversComponent } from './clm-section-covers.component';

describe('ClmSectionCoversComponent', () => {
  let component: ClmSectionCoversComponent;
  let fixture: ComponentFixture<ClmSectionCoversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClmSectionCoversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClmSectionCoversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
