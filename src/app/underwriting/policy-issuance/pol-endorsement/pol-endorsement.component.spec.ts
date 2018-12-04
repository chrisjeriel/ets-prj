import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolEndorsementComponent } from './pol-endorsement.component';

describe('PolEndorsementComponent', () => {
  let component: PolEndorsementComponent;
  let fixture: ComponentFixture<PolEndorsementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolEndorsementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolEndorsementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
