import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetsComponent } from './fixed-assets.component';

describe('FixedAssetsComponent', () => {
  let component: FixedAssetsComponent;
  let fixture: ComponentFixture<FixedAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
