import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolGenInfoCoverOpenLetterComponent } from './pol-gen-info-cover-open-letter.component';

describe('PolGenInfoCoverOpenLetterComponent', () => {
  let component: PolGenInfoCoverOpenLetterComponent;
  let fixture: ComponentFixture<PolGenInfoCoverOpenLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolGenInfoCoverOpenLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolGenInfoCoverOpenLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
