import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonEndDataChkComponent } from './mon-end-data-chk.component';

describe('MonEndDataChkComponent', () => {
  let component: MonEndDataChkComponent;
  let fixture: ComponentFixture<MonEndDataChkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonEndDataChkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonEndDataChkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
