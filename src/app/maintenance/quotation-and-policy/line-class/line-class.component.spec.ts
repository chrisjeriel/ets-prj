import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineClassComponent } from './line-class.component';

describe('LineClassComponent', () => {
  let component: LineClassComponent;
  let fixture: ComponentFixture<LineClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
