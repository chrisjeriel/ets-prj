import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteEndorsementComponent } from './quote-endorsement.component';

describe('QuoteEndorsmentComponent', () => {
  let component: QuoteEndorsementComponent;
  let fixture: ComponentFixture<QuoteEndorsementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteEndorsementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteEndorsementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
