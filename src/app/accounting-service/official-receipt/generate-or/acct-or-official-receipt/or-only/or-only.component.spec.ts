import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrOnlyComponent } from './or-only.component';

describe('OrOnlyComponent', () => {
  let component: OrOnlyComponent;
  let fixture: ComponentFixture<OrOnlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrOnlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
