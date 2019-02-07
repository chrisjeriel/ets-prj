import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeDataCheckingComponent } from './me-data-checking.component';

describe('MeDataCheckingComponent', () => {
  let component: MeDataCheckingComponent;
  let fixture: ComponentFixture<MeDataCheckingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeDataCheckingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeDataCheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
