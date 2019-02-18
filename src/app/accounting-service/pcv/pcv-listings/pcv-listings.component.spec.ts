import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcvListingsComponent } from './pcv-listings.component';

describe('PcvListingsComponent', () => {
  let component: PcvListingsComponent;
  let fixture: ComponentFixture<PcvListingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcvListingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcvListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
