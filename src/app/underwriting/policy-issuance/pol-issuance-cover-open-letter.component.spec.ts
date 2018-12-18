import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolIssuanceCoverOpenLetterComponent } from './pol-issuance-cover-open-letter.component';

describe('PolIssuanceCoverOpenLetterComponent', () => {
  let component: PolIssuanceCoverOpenLetterComponent;
  let fixture: ComponentFixture<PolIssuanceCoverOpenLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolIssuanceCoverOpenLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolIssuanceCoverOpenLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
