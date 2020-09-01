import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltParListingComponent } from './alt-par-listing.component';

describe('AltParListingComponent', () => {
  let component: AltParListingComponent;
  let fixture: ComponentFixture<AltParListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltParListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltParListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
