import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArEntryComponent } from './ar-entry.component';

describe('ArEntryComponent', () => {
  let component: ArEntryComponent;
  let fixture: ComponentFixture<ArEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
