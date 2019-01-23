import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolGenInfoOpenCoverComponent } from './pol-gen-info-open-cover.component';

describe('PolGenInfoOpenCoverComponent', () => {
  let component: PolGenInfoOpenCoverComponent;
  let fixture: ComponentFixture<PolGenInfoOpenCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolGenInfoOpenCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolGenInfoOpenCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
