import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnQuotationWordingsComponent } from './mtn-quotation-wordings.component';

describe('MtnQuotationWordingsComponent', () => {
  let component: MtnQuotationWordingsComponent;
  let fixture: ComponentFixture<MtnQuotationWordingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnQuotationWordingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnQuotationWordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
