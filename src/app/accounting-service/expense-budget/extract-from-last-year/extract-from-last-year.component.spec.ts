import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractFromLastYearComponent } from './extract-from-last-year.component';

describe('ExtractFromLastYearComponent', () => {
  let component: ExtractFromLastYearComponent;
  let fixture: ComponentFixture<ExtractFromLastYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractFromLastYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractFromLastYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
