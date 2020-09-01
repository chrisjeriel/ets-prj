import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolFulItemComponent } from './pol-ful-item.component';

describe('PolFulItemComponent', () => {
  let component: PolFulItemComponent;
  let fixture: ComponentFixture<PolFulItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolFulItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolFulItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
