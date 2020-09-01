import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctDetailsComponent } from './acct-details.component';

describe('AcctDetailsComponent', () => {
  let component: AcctDetailsComponent;
  let fixture: ComponentFixture<AcctDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
