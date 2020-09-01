import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCMDMComponent } from './generate-cmdm.component';

describe('GenerateCMDMComponent', () => {
  let component: GenerateCMDMComponent;
  let fixture: ComponentFixture<GenerateCMDMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateCMDMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateCMDMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
