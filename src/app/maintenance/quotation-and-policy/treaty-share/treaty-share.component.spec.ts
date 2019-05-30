import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatyShareComponent } from './treaty-share.component';

describe('TreatyShareComponent', () => {
  let component: TreatyShareComponent;
  let fixture: ComponentFixture<TreatyShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatyShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatyShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
