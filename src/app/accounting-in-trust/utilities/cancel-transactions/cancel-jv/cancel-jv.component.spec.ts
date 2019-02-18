import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelJvComponent } from './cancel-jv.component';

describe('CancelJvComponent', () => {
  let component: CancelJvComponent;
  let fixture: ComponentFixture<CancelJvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelJvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelJvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
