import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArDetailsComponent } from './ar-**details.component';

describe('ArDetailsComponent', () => {
  let component: ArDetailsComponent;
  let fixture: ComponentFixture<ArDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
