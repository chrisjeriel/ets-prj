import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteWordingComponent } from './quote-wording.component';

describe('QuoteWordingComponent', () => {
  let component: QuoteWordingComponent;
  let fixture: ComponentFixture<QuoteWordingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteWordingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteWordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
