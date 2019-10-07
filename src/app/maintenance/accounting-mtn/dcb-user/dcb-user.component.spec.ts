import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcbUserComponent } from './dcb-user.component';

describe('DcbUserComponent', () => {
  let component: DcbUserComponent;
  let fixture: ComponentFixture<DcbUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcbUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcbUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
