import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnappliedCollectionComponent } from './unapplied-collection.component';

describe('UnappliedCollectionComponent', () => {
  let component: UnappliedCollectionComponent;
  let fixture: ComponentFixture<UnappliedCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnappliedCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnappliedCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
