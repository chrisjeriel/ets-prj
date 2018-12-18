import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolDistComponent } from './pol-dist.component';

describe('PolDistComponent', () => {
  let component: PolDistComponent;
  let fixture: ComponentFixture<PolDistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolDistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolDistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
