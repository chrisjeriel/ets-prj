import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlComponent } from './sl.component';

describe('SlComponent', () => {
  let component: SlComponent;
  let fixture: ComponentFixture<SlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
