import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatyLimitComponent } from './treaty-limit.component';

describe('TreatyLimitComponent', () => {
  let component: TreatyLimitComponent;
  let fixture: ComponentFixture<TreatyLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatyLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatyLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
