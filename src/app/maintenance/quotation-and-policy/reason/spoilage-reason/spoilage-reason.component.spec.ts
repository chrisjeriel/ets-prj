import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpoilageReasonComponent } from './spoilage-reason.component';

describe('SpoilageReasonComponent', () => {
  let component: SpoilageReasonComponent;
  let fixture: ComponentFixture<SpoilageReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpoilageReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpoilageReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
