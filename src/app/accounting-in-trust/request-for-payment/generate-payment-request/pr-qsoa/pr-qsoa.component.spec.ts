import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrQsoaComponent } from './pr-qsoa.component';

describe('PrQsoaComponent', () => {
  let component: PrQsoaComponent;
  let fixture: ComponentFixture<PrQsoaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrQsoaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrQsoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
