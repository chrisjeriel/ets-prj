import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolAlopComponent } from './pol-alop.component';

describe('PolAlopComponent', () => {
  let component: PolAlopComponent;
  let fixture: ComponentFixture<PolAlopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolAlopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolAlopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
