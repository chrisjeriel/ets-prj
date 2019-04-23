import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolInqClaimsComponent } from './pol-inq-claims.component';

describe('PolInqClaimsComponent', () => {
  let component: PolInqClaimsComponent;
  let fixture: ComponentFixture<PolInqClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolInqClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolInqClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
