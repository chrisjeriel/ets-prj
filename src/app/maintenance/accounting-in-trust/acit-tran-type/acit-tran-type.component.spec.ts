import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcitTranTypeComponent } from './acit-tran-type.component';

describe('AcitTranTypeComponent', () => {
  let component: AcitTranTypeComponent;
  let fixture: ComponentFixture<AcitTranTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcitTranTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcitTranTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
