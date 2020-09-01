import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrServiceFeeLocalComponent } from './or-service-fee-local.component';

describe('OrServiceFeeLocalComponent', () => {
  let component: OrServiceFeeLocalComponent;
  let fixture: ComponentFixture<OrServiceFeeLocalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrServiceFeeLocalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrServiceFeeLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
