import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateJvComponent } from './generate-jv.component';

describe('GenerateJvComponent', () => {
  let component: GenerateJvComponent;
  let fixture: ComponentFixture<GenerateJvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateJvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateJvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
