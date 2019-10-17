import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeClassComponent } from './payee-class.component';

describe('PayeeClassComponent', () => {
  let component: PayeeClassComponent;
  let fixture: ComponentFixture<PayeeClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayeeClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
