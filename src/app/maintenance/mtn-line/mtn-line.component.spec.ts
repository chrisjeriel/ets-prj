import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnLineComponent } from './mtn-line.component';

describe('MtnLineComponent', () => {
  let component: MtnLineComponent;
  let fixture: ComponentFixture<MtnLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
