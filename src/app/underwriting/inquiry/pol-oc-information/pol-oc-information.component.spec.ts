import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolOcInformationComponent } from './pol-oc-information.component';

describe('PolOcInformationComponent', () => {
  let component: PolOcInformationComponent;
  let fixture: ComponentFixture<PolOcInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolOcInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolOcInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
