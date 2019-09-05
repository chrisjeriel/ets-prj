import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvTreatyPullOutComponent } from './jv-treaty-pull-out.component';

describe('JvTreatyPullOutComponent', () => {
  let component: JvTreatyPullOutComponent;
  let fixture: ComponentFixture<JvTreatyPullOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvTreatyPullOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvTreatyPullOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
