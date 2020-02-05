import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolBordereauxComponent } from './pol-bordereaux.component';

describe('PolBordereauxComponent', () => {
  let component: PolBordereauxComponent;
  let fixture: ComponentFixture<PolBordereauxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolBordereauxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolBordereauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
