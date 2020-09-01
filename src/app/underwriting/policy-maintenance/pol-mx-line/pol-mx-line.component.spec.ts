import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolMxLineComponent } from './pol-mx-line.component';

describe('PolMxLineComponent', () => {
  let component: PolMxLineComponent;
  let fixture: ComponentFixture<PolMxLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolMxLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolMxLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
