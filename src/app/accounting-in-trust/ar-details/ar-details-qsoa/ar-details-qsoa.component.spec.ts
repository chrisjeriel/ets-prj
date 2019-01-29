import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArDetailsQsoaComponent } from './ar-details-qsoa.component';

describe('ArDetailsQsoaComponent', () => {
  let component: ArDetailsQsoaComponent;
  let fixture: ComponentFixture<ArDetailsQsoaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArDetailsQsoaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArDetailsQsoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
