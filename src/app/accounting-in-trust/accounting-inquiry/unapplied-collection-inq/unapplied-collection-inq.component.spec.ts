import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnappliedCollectionInqComponent } from './unapplied-collection-inq.component';

describe('UnappliedCollectionInqComponent', () => {
  let component: UnappliedCollectionInqComponent;
  let fixture: ComponentFixture<UnappliedCollectionInqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnappliedCollectionInqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnappliedCollectionInqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
