import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnRegionComponent } from './mtn-region.component';

describe('MtnRegionComponent', () => {
  let component: MtnRegionComponent;
  let fixture: ComponentFixture<MtnRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
