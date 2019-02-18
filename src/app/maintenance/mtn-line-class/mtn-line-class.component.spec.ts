import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnLineClassComponent } from './mtn-line-class.component';

describe('MtnLineClassComponent', () => {
  let component: MtnLineClassComponent;
  let fixture: ComponentFixture<MtnLineClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnLineClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnLineClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
