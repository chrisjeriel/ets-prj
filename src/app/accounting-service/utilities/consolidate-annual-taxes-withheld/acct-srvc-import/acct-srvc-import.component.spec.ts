import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcctSrvcImportComponent } from './acct-srvc-import.component';

describe('AcctSrvcImportComponent', () => {
  let component: AcctSrvcImportComponent;
  let fixture: ComponentFixture<AcctSrvcImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcctSrvcImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctSrvcImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
