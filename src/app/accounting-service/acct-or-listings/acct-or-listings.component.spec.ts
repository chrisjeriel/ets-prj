import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctOrListingsComponent } from './acct-or-listings.component';

describe('AcctOrListingsComponent', () => {
  let component: AcctOrListingsComponent;
  let fixture: ComponentFixture<AcctOrListingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctOrListingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctOrListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
