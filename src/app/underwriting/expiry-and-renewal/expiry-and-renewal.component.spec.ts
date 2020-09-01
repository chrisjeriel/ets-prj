import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryAndRenewalComponent } from './expiry-and-renewal.component';

describe('ExpiryAndRenewalComponent', () => {
  let component: ExpiryAndRenewalComponent;
  let fixture: ComponentFixture<ExpiryAndRenewalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiryAndRenewalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiryAndRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
