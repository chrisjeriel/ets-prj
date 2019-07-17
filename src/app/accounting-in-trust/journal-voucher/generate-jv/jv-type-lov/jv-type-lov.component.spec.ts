import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvTypeLovComponent } from './jv-type-lov.component';

describe('JvTypeLovComponent', () => {
  let component: JvTypeLovComponent;
  let fixture: ComponentFixture<JvTypeLovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvTypeLovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvTypeLovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
