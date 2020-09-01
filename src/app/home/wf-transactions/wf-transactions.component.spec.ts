import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WfTransactionsComponent } from './wf-transactions.component';

describe('WfTransactionsComponent', () => {
  let component: WfTransactionsComponent;
  let fixture: ComponentFixture<WfTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WfTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
