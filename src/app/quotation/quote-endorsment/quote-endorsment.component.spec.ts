import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteEndorsmentComponent } from './quote-endorsment.component';

describe('QuoteEndorsmentComponent', () => {
  let component: QuoteEndorsmentComponent;
  let fixture: ComponentFixture<QuoteEndorsmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteEndorsmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteEndorsmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
