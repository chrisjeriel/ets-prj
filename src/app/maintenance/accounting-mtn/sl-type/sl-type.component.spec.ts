import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlTypeComponent } from './sl-type.component';

describe('SlTypeComponent', () => {
  let component: SlTypeComponent;
  let fixture: ComponentFixture<SlTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
