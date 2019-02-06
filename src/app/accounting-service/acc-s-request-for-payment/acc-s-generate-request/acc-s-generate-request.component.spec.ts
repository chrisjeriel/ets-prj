import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccSGenerateRequestComponent } from './acc-s-generate-request.component';

describe('AccSGenerateRequestComponent', () => {
  let component: AccSGenerateRequestComponent;
  let fixture: ComponentFixture<AccSGenerateRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccSGenerateRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccSGenerateRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
