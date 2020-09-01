import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramParameterComponent } from './program-parameter.component';

describe('ProgramParameterComponent', () => {
  let component: ProgramParameterComponent;
  let fixture: ComponentFixture<ProgramParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
