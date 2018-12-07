import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolPostComponent } from './pol-post.component';

describe('PolPostComponent', () => {
  let component: PolPostComponent;
  let fixture: ComponentFixture<PolPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
