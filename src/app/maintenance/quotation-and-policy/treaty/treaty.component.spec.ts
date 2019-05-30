import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatyComponent } from './treaty.component';

describe('TreatyComponent', () => {
  let component: TreatyComponent;
  let fixture: ComponentFixture<TreatyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
