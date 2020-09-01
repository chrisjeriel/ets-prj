import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrPreviewComponent } from './or-preview.component';

describe('OrPreviewComponent', () => {
  let component: OrPreviewComponent;
  let fixture: ComponentFixture<OrPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
