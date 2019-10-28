import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcseTranTypeComponent } from './acse-tran-type.component';

describe('AcseTranTypeComponent', () => {
  let component: AcseTranTypeComponent;
  let fixture: ComponentFixture<AcseTranTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcseTranTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcseTranTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
