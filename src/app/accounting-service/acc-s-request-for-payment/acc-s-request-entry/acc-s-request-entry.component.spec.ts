import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccSRequestEntryComponent } from './acc-s-request-entry.component';

describe('AccSRequestEntryComponent', () => {
  let component: AccSRequestEntryComponent;
  let fixture: ComponentFixture<AccSRequestEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccSRequestEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccSRequestEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
