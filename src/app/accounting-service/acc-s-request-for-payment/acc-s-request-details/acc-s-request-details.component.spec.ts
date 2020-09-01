import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccSRequestDetailsComponent } from './acc-s-request-details.component';

describe('AccSRequestDetailsComponent', () => {
  let component: AccSRequestDetailsComponent;
  let fixture: ComponentFixture<AccSRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccSRequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccSRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
