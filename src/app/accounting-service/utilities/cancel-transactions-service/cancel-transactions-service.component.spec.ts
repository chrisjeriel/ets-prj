import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTransactionsServiceComponent } from './cancel-transactions-service.component';

describe('CancelTransactionsServiceComponent', () => {
  let component: CancelTransactionsServiceComponent;
  let fixture: ComponentFixture<CancelTransactionsServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelTransactionsServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTransactionsServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
