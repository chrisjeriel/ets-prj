import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpoilPolAltComponent } from './spoil-pol-alt.component';

describe('SpoilPolAltComponent', () => {
  let component: SpoilPolAltComponent;
  let fixture: ComponentFixture<SpoilPolAltComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpoilPolAltComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpoilPolAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
