import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvtSecTypeComponent } from './invt-sec-type.component';

describe('InvtSecTypeComponent', () => {
  let component: InvtSecTypeComponent;
  let fixture: ComponentFixture<InvtSecTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvtSecTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvtSecTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
