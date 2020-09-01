import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInstallmentComponent } from './update-installment.component';

describe('UpdateInstallmentComponent', () => {
  let component: UpdateInstallmentComponent;
  let fixture: ComponentFixture<UpdateInstallmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateInstallmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateInstallmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
