import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParListingComponent } from './par-listing.component';

describe('ParListingComponent', () => {
  let component: ParListingComponent;
  let fixture: ComponentFixture<ParListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
