import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteOptionComponent } from './quote-option.component';

describe('QuoteOptionComponent', () => {
  let component: QuoteOptionComponent;
  let fixture: ComponentFixture<QuoteOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
