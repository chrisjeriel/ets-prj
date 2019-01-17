import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolMxCedingCoComponent } from './pol-mx-ceding-co.component';

describe('PolMxCedingCoComponent', () => {
  let component: PolMxCedingCoComponent;
  let fixture: ComponentFixture<PolMxCedingCoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolMxCedingCoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolMxCedingCoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
