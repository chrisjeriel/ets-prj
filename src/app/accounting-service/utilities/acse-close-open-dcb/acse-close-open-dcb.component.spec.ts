import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcseCloseOpenDcbComponent } from './acse-close-open-dcb.component';

describe('AcseCloseOpenDcbComponent', () => {
  let component: AcseCloseOpenDcbComponent;
  let fixture: ComponentFixture<AcseCloseOpenDcbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcseCloseOpenDcbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcseCloseOpenDcbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
