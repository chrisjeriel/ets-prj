import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvOffsettingAgainstNegativeTreatyComponent } from './jv-offsetting-against-negative-treaty.component';

describe('JvOffsettingAgainstNegativeTreatyComponent', () => {
  let component: JvOffsettingAgainstNegativeTreatyComponent;
  let fixture: ComponentFixture<JvOffsettingAgainstNegativeTreatyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvOffsettingAgainstNegativeTreatyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvOffsettingAgainstNegativeTreatyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
