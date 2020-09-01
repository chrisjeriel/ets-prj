import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvOverdueAccountsAgainstTreatyComponent } from './jv-overdue-accounts-against-treaty.component';

describe('JvOverdueAccountsAgainstTreatyComponent', () => {
  let component: JvOverdueAccountsAgainstTreatyComponent;
  let fixture: ComponentFixture<JvOverdueAccountsAgainstTreatyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvOverdueAccountsAgainstTreatyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvOverdueAccountsAgainstTreatyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
