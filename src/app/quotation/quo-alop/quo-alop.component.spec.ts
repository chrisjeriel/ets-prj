import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoAlopComponent } from './quo-alop.component';

describe('QuoAlopComponent', () => {
  let component: QuoAlopComponent;
  let fixture: ComponentFixture<QuoAlopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoAlopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoAlopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
