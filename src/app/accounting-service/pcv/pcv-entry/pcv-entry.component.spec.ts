import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcvEntryComponent } from './pcv-entry.component';

describe('PcvEntryComponent', () => {
  let component: PcvEntryComponent;
  let fixture: ComponentFixture<PcvEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcvEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcvEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
