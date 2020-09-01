import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArListingsComponent } from './ar-listings.component';

describe('ArListingsComponent', () => {
  let component: ArListingsComponent;
  let fixture: ComponentFixture<ArListingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArListingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
