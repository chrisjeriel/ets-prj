import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateOrComponent } from './generate-or.component';

describe('GenerateOrComponent', () => {
  let component: GenerateOrComponent;
  let fixture: ComponentFixture<GenerateOrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateOrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateOrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
