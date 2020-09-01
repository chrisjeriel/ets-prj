import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingServiceExtractComponent } from './accounting-service-extract.component';

describe('AccountingServiceExtractComponent', () => {
  let component: AccountingServiceExtractComponent;
  let fixture: ComponentFixture<AccountingServiceExtractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingServiceExtractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingServiceExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
