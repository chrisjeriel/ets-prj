import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnBankComponent } from './mtn-bank.component';

describe('MtnBankComponent', () => {
  let component: MtnBankComponent;
  let fixture: ComponentFixture<MtnBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
