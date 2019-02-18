import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelArComponent } from './cancel-ar.component';

describe('CancelArComponent', () => {
  let component: CancelArComponent;
  let fixture: ComponentFixture<CancelArComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelArComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
