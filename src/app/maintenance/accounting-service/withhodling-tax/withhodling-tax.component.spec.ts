import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithhodlingTaxComponent } from './withhodling-tax.component';

describe('WithhodlingTaxComponent', () => {
  let component: WithhodlingTaxComponent;
  let fixture: ComponentFixture<WithhodlingTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithhodlingTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithhodlingTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
