import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCrestaComponent } from './mtn-cresta.component';

describe('MtnCrestaComponent', () => {
  let component: MtnCrestaComponent;
  let fixture: ComponentFixture<MtnCrestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCrestaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCrestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
