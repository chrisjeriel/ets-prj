import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnClaimsComponent } from './mtn-claims.component';

describe('MtnClaimsComponent', () => {
  let component: MtnClaimsComponent;
  let fixture: ComponentFixture<MtnClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
