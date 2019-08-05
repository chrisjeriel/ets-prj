import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnPrintableNamesComponent } from './mtn-printable-names.component';

describe('MtnPrintableNamesComponent', () => {
  let component: MtnPrintableNamesComponent;
  let fixture: ComponentFixture<MtnPrintableNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnPrintableNamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnPrintableNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
