import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateDocumentsComponent } from './generate-documents.component';

describe('GenerateDocumentsComponent', () => {
  let component: GenerateDocumentsComponent;
  let fixture: ComponentFixture<GenerateDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
