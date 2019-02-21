import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvOffsettingAgainstLossesComponent } from './jv-offsetting-against-losses.component';

describe('JvOffsettingAgainstLossesComponent', () => {
  let component: JvOffsettingAgainstLossesComponent;
  let fixture: ComponentFixture<JvOffsettingAgainstLossesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvOffsettingAgainstLossesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvOffsettingAgainstLossesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
