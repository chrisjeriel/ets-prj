import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QsoaReinsuranceComponent } from './qsoa-reinsurance.component';

describe('QsoaReinsuranceComponent', () => {
  let component: QsoaReinsuranceComponent;
  let fixture: ComponentFixture<QsoaReinsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QsoaReinsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QsoaReinsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
