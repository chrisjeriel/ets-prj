import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArPreviewComponent } from './ar-preview.component';

describe('ArPreviewComponent', () => {
  let component: ArPreviewComponent;
  let fixture: ComponentFixture<ArPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
