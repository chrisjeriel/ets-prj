import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolSummarizedInqComponent } from './pol-summarized-inq.component';

describe('PolSummarizedInqComponent', () => {
  let component: PolSummarizedInqComponent;
  let fixture: ComponentFixture<PolSummarizedInqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolSummarizedInqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolSummarizedInqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
