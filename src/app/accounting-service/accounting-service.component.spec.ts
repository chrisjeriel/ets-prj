import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingServiceComponent } from './accounting-service.component';

describe('AccountingServiceComponent', () => {
  let component: AccountingServiceComponent;
  let fixture: ComponentFixture<AccountingServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
