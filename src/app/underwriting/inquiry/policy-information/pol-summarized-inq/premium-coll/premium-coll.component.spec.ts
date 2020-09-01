import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumCollComponent } from './premium-coll.component';

describe('PremiumCollComponent', () => {
  let component: PremiumCollComponent;
  let fixture: ComponentFixture<PremiumCollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumCollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumCollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
