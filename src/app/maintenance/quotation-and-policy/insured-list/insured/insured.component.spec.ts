import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredComponent } from './insured.component';

describe('InsuredComponent', () => {
  let component: InsuredComponent;
  let fixture: ComponentFixture<InsuredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
