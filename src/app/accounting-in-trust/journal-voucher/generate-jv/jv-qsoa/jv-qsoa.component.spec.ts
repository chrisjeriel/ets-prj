import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvQsoaComponent } from './jv-qsoa.component';

describe('JvQsoaComponent', () => {
  let component: JvQsoaComponent;
  let fixture: ComponentFixture<JvQsoaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvQsoaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvQsoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
