import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGeneralInfoComponent } from './update-general-info.component';

describe('UpdateGeneralInfoComponent', () => {
  let component: UpdateGeneralInfoComponent;
  let fixture: ComponentFixture<UpdateGeneralInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateGeneralInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
