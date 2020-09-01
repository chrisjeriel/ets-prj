import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccSChangeTranStatNewComponent } from './acc-s-change-tran-stat-new.component';

describe('AccSChangeTranStatNewComponent', () => {
  let component: AccSChangeTranStatNewComponent;
  let fixture: ComponentFixture<AccSChangeTranStatNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccSChangeTranStatNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccSChangeTranStatNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
