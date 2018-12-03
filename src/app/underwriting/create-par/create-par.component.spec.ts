import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePARComponent } from './create-par.component';

describe('CreatePARComponent', () => {
  let component: CreatePARComponent;
  let fixture: ComponentFixture<CreatePARComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePARComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePARComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
