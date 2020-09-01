import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvChangeTranStatComponent } from './jv-change-tran-stat.component';

describe('JvChangeTranStatComponent', () => {
  let component: JvChangeTranStatComponent;
  let fixture: ComponentFixture<JvChangeTranStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvChangeTranStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvChangeTranStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
