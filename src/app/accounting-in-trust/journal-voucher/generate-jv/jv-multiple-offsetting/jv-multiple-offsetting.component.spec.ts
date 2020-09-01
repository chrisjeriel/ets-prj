import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvMultipleOffsettingComponent } from './jv-multiple-offsetting.component';

describe('JvMultipleOffsettingComponent', () => {
  let component: JvMultipleOffsettingComponent;
  let fixture: ComponentFixture<JvMultipleOffsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvMultipleOffsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvMultipleOffsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
