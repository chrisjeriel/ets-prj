import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnObjectComponent } from './mtn-object.component';

describe('MtnObjectComponent', () => {
  let component: MtnObjectComponent;
  let fixture: ComponentFixture<MtnObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
