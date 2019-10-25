import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcitDcbNoComponent } from './acit-dcb-no.component';

describe('AcitDcbNoComponent', () => {
  let component: AcitDcbNoComponent;
  let fixture: ComponentFixture<AcitDcbNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcitDcbNoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcitDcbNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
