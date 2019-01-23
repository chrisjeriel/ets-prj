import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvDetailsComponent } from './cv-details.component';

describe('CvDetailsComponent', () => {
  let component: CvDetailsComponent;
  let fixture: ComponentFixture<CvDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
