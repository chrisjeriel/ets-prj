import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnCatPerilModalComponent } from './mtn-cat-peril-modal.component';

describe('MtnCatPerilModalComponent', () => {
  let component: MtnCatPerilModalComponent;
  let fixture: ComponentFixture<MtnCatPerilModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnCatPerilModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnCatPerilModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
