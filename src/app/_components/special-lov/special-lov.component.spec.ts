import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialLovComponent } from './special-lov.component';

describe('SpecialLovComponent', () => {
  let component: SpecialLovComponent;
  let fixture: ComponentFixture<SpecialLovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialLovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialLovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
