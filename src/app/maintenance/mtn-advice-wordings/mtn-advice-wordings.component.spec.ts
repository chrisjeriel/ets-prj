import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnAdviceWordingsComponent } from './mtn-advice-wordings.component';

describe('MtnAdviceWordingsComponent', () => {
  let component: MtnAdviceWordingsComponent;
  let fixture: ComponentFixture<MtnAdviceWordingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnAdviceWordingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnAdviceWordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
