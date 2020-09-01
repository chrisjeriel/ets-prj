import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolCreateAlterationPARComponent } from './pol-create-alteration-par.component';

describe('PolCreateAlterationPARComponent', () => {
  let component: PolCreateAlterationPARComponent;
  let fixture: ComponentFixture<PolCreateAlterationPARComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolCreateAlterationPARComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolCreateAlterationPARComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
