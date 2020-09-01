import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolItemComponent } from './pol-item.component';

describe('PolItemComponent', () => {
  let component: PolItemComponent;
  let fixture: ComponentFixture<PolItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
