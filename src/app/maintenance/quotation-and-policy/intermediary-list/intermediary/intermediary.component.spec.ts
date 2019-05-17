import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntermediaryComponent } from './intermediary.component';

describe('IntermediaryComponent', () => {
  let component: IntermediaryComponent;
  let fixture: ComponentFixture<IntermediaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntermediaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntermediaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
