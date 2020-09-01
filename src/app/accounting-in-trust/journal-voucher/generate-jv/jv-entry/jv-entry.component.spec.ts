import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvEntryComponent } from './jv-entry.component';

describe('JvEntryComponent', () => {
  let component: JvEntryComponent;
  let fixture: ComponentFixture<JvEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
