import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteStatusReasonComponent } from './quote-status-reason.component';

describe('QuoteStatusReasonComponent', () => {
  let component: QuoteStatusReasonComponent;
  let fixture: ComponentFixture<QuoteStatusReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteStatusReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteStatusReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
