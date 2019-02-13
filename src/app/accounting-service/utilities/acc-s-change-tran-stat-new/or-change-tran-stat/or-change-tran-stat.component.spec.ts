import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrChangeTranStatComponent } from './or-change-tran-stat.component';

describe('OrChangeTranStatComponent', () => {
  let component: OrChangeTranStatComponent;
  let fixture: ComponentFixture<OrChangeTranStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrChangeTranStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrChangeTranStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
