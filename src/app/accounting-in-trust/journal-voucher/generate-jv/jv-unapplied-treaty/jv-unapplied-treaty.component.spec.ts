import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvUnappliedTreatyComponent } from './jv-unapplied-treaty.component';

describe('JvUnappliedTreatyComponent', () => {
  let component: JvUnappliedTreatyComponent;
  let fixture: ComponentFixture<JvUnappliedTreatyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvUnappliedTreatyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvUnappliedTreatyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
