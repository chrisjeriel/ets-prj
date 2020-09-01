import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCvServiceComponent } from './generate-cv-service.component';

describe('GenerateCvServiceComponent', () => {
  let component: GenerateCvServiceComponent;
  let fixture: ComponentFixture<GenerateCvServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateCvServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateCvServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
