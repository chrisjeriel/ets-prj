import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingLovComponent } from './loading-lov.component';

describe('LoadingLovComponent', () => {
  let component: LoadingLovComponent;
  let fixture: ComponentFixture<LoadingLovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingLovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingLovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
