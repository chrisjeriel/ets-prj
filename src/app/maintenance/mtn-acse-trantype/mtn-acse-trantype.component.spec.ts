import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnAcseTrantypeComponent } from './mtn-acse-trantype.component';

describe('MtnAcseTrantypeComponent', () => {
  let component: MtnAcseTrantypeComponent;
  let fixture: ComponentFixture<MtnAcseTrantypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnAcseTrantypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnAcseTrantypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
