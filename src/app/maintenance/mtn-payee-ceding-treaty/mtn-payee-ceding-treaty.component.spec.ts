import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnPayeeCedingTreatyComponent } from './mtn-payee-ceding-treaty.component';

describe('MtnPayeeCedingTreatyComponent', () => {
  let component: MtnPayeeCedingTreatyComponent;
  let fixture: ComponentFixture<MtnPayeeCedingTreatyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnPayeeCedingTreatyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnPayeeCedingTreatyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
