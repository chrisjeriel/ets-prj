import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolIssuanceOpenCoverLetterComponent } from './pol-issuance-open-cover-letter.component';

describe('PolIssuanceCoverOpenLetterComponent', () => {
  let component:  PolIssuanceOpenCoverLetterComponent;
  let fixture: ComponentFixture< PolIssuanceOpenCoverLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  PolIssuanceOpenCoverLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent( PolIssuanceOpenCoverLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
