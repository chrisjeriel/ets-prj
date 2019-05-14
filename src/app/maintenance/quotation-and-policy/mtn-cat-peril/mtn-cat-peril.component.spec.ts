import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCATPerilComponent } from './mtn-cat-peril.component';

describe('MtnCATPerilComponent', () => {
  let component: MtnCATPerilComponent;
  let fixture: ComponentFixture<MtnCATPerilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCATPerilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCATPerilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
