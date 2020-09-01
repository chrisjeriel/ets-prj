import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCrestaZoneComponent } from './mtn-cresta-zone.component';

describe('MtnCrestaZoneComponent', () => {
  let component: MtnCrestaZoneComponent;
  let fixture: ComponentFixture<MtnCrestaZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCrestaZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCrestaZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
