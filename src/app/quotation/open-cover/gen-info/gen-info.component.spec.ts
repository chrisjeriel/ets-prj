import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenInfoComponent } from './gen-info.component';

describe('GenInfoComponent', () => {
  let component: GenInfoComponent;
  let fixture: ComponentFixture<GenInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
