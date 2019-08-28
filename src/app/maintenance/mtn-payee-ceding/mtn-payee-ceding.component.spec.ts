import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnPayeeCedingComponent } from './mtn-payee-ceding.component';

describe('MtnPayeeCedingComponent', () => {
  let component: MtnPayeeCedingComponent;
  let fixture: ComponentFixture<MtnPayeeCedingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnPayeeCedingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnPayeeCedingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
