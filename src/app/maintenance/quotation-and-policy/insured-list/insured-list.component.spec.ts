import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuredListComponent } from './insured-list.component';

describe('InsuredListComponent', () => {
  let component: InsuredListComponent;
  let fixture: ComponentFixture<InsuredListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuredListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuredListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
