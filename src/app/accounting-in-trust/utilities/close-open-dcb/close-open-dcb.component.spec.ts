import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseOpenDcbComponent } from './close-open-dcb.component';

describe('CloseOpenDcbComponent', () => {
  let component: CloseOpenDcbComponent;
  let fixture: ComponentFixture<CloseOpenDcbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseOpenDcbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseOpenDcbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
