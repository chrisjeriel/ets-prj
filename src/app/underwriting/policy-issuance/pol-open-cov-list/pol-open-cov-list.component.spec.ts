import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolOpenCovListComponent } from './pol-open-cov-list.component';

describe('PolOpenCovListComponent', () => {
  let component: PolOpenCovListComponent;
  let fixture: ComponentFixture<PolOpenCovListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolOpenCovListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolOpenCovListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
