import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvRiskMgtAllocComponent } from './jv-risk-mgt-alloc.component';

describe('JvRiskMgtAllocComponent', () => {
  let component: JvRiskMgtAllocComponent;
  let fixture: ComponentFixture<JvRiskMgtAllocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvRiskMgtAllocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvRiskMgtAllocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
