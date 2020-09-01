import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfCessionComponent } from './type-of-cession.component';

describe('TypeOfCessionComponent', () => {
  let component: TypeOfCessionComponent;
  let fixture: ComponentFixture<TypeOfCessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeOfCessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOfCessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
