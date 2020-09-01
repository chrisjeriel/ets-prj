import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnearnedPremiumComponent } from './unearned-premium.component';

describe('UnearnedPremiumComponent', () => {
  let component: UnearnedPremiumComponent;
  let fixture: ComponentFixture<UnearnedPremiumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnearnedPremiumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnearnedPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
