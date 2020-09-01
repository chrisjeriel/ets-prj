import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeQuoteStatusComponent } from './change-quote-status.component';

describe('ChangeQuoteStatusComponent', () => {
  let component: ChangeQuoteStatusComponent;
  let fixture: ComponentFixture<ChangeQuoteStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeQuoteStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeQuoteStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
