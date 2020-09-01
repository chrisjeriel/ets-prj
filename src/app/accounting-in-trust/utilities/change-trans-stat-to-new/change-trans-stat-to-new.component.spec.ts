import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTransStatToNewComponent } from './change-trans-stat-to-new.component';

describe('ChangeTransStatToNewComponent', () => {
  let component: ChangeTransStatToNewComponent;
  let fixture: ComponentFixture<ChangeTransStatToNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeTransStatToNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTransStatToNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
