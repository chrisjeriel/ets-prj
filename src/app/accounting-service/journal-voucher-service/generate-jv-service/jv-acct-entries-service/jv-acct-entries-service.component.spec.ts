import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvAcctEntriesServiceComponent } from './jv-acct-entries-service.component';

describe('JvAcctEntriesServiceComponent', () => {
  let component: JvAcctEntriesServiceComponent;
  let fixture: ComponentFixture<JvAcctEntriesServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvAcctEntriesServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvAcctEntriesServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
