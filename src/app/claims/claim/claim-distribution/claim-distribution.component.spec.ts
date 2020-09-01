import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimDistributionComponent } from './claim-distribution.component';

describe('ClaimDistributionComponent', () => {
  let component: ClaimDistributionComponent;
  let fixture: ComponentFixture<ClaimDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
