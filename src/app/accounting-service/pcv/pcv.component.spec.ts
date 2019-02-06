import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcvComponent } from './pcv.component';

describe('PcvComponent', () => {
  let component: PcvComponent;
  let fixture: ComponentFixture<PcvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
