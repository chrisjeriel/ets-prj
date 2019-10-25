import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcseDcbNoComponent } from './acse-dcb-no.component';

describe('AcseDcbNoComponent', () => {
  let component: AcseDcbNoComponent;
  let fixture: ComponentFixture<AcseDcbNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcseDcbNoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcseDcbNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
