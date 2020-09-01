import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvDetailsComponent } from './jv-details.component';

describe('JvDetailsComponent', () => {
  let component: JvDetailsComponent;
  let fixture: ComponentFixture<JvDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
