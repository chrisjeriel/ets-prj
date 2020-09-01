import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryListingComponent } from './expiry-listing.component';

describe('ExpiryListingComponent', () => {
  let component: ExpiryListingComponent;
  let fixture: ComponentFixture<ExpiryListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiryListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiryListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
