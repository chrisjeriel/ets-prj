import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnBlockComponent } from './mtn-block.component';

describe('MtnBlockComponent', () => {
  let component: MtnBlockComponent;
  let fixture: ComponentFixture<MtnBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
