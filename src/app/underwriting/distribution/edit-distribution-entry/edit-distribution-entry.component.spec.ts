import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDistributionEntryComponent } from './edit-distribution-entry.component';

describe('EditDistributionEntryComponent', () => {
  let component: EditDistributionEntryComponent;
  let fixture: ComponentFixture<EditDistributionEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDistributionEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDistributionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
