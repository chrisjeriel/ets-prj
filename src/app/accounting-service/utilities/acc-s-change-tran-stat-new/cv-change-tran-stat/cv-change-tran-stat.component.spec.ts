import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvChangeTranStatComponent } from './cv-change-tran-stat.component';

describe('CvChangeTranStatComponent', () => {
  let component: CvChangeTranStatComponent;
  let fixture: ComponentFixture<CvChangeTranStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvChangeTranStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvChangeTranStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
