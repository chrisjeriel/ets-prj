import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnTreatyComponent } from './mtn-treaty.component';

describe('MtnTreatyComponent', () => {
  let component: MtnTreatyComponent;
  let fixture: ComponentFixture<MtnTreatyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnTreatyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnTreatyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
