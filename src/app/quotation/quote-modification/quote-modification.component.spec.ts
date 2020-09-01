import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteModificationComponent } from './quote-modification.component';

describe('QuoteModificationComponent', () => {
  let component: QuoteModificationComponent;
  let fixture: ComponentFixture<QuoteModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
