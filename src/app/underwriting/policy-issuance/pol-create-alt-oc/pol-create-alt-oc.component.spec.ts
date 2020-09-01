import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolCreateAltOcComponent } from './pol-create-alt-oc.component';

describe('PolCreateAltOcComponent', () => {
  let component: PolCreateAltOcComponent;
  let fixture: ComponentFixture<PolCreateAltOcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolCreateAltOcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolCreateAltOcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
