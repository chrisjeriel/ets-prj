import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialReceiptComponent } from './official-receipt.component';

describe('OfficialReceiptComponent', () => {
  let component: OfficialReceiptComponent;
  let fixture: ComponentFixture<OfficialReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficialReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficialReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
