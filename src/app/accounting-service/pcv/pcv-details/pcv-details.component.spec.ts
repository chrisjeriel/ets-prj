import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcvDetailsComponent } from './pcv-details.component';

describe('PcvDetailsComponent', () => {
  let component: PcvDetailsComponent;
  let fixture: ComponentFixture<PcvDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcvDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcvDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
