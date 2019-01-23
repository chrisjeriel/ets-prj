import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInformationComponent } from './update-information.component';

describe('UpdateInformationComponent', () => {
  let component: UpdateInformationComponent;
  let fixture: ComponentFixture<UpdateInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
