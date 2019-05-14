import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCatPerilComponent } from './mtn-cat-peril.component';

describe('MtnCatPerilComponent', () => {
  let component: MtnCatPerilComponent;
  let fixture: ComponentFixture<MtnCatPerilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCatPerilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCatPerilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
