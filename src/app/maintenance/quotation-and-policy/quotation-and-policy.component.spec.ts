import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationAndPolicyComponent } from './quotation-and-policy.component';

describe('QuotationAndPolicyComponent', () => {
  let component: QuotationAndPolicyComponent;
  let fixture: ComponentFixture<QuotationAndPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationAndPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationAndPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
