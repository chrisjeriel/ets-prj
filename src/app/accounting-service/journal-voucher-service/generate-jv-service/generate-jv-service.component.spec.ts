import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateJvServiceComponent } from './generate-jv-service.component';

describe('GenerateJvServiceComponent', () => {
  let component: GenerateJvServiceComponent;
  let fixture: ComponentFixture<GenerateJvServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateJvServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateJvServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
