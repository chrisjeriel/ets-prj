import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyForPrintingComponent } from './ready-for-printing.component';

describe('ReadyForPrintingComponent', () => {
  let component: ReadyForPrintingComponent;
  let fixture: ComponentFixture<ReadyForPrintingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadyForPrintingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyForPrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
