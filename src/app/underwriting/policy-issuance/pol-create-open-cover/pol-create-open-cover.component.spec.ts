import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolCreateOpenCoverComponent } from './pol-create-open-cover.component';

describe('PolCreateOpenCoverComponent', () => {
  let component: PolCreateOpenCoverComponent;
  let fixture: ComponentFixture<PolCreateOpenCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolCreateOpenCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolCreateOpenCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
