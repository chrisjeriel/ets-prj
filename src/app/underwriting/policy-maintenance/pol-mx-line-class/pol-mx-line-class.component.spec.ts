import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolMxLineClassComponent } from './pol-mx-line-class.component';

describe('PolMxLineClassComponent', () => {
  let component: PolMxLineClassComponent;
  let fixture: ComponentFixture<PolMxLineClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolMxLineClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolMxLineClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
