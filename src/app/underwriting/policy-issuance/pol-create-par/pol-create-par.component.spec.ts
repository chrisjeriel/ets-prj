import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolCreatePARComponent } from './pol-create-par.component';

describe('PolCreatePARComponent', () => {
  let component: PolCreatePARComponent;
  let fixture: ComponentFixture<PolCreatePARComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolCreatePARComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolCreatePARComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
