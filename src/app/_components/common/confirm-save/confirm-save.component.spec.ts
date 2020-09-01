import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSaveComponent } from './confirm-save.component';

describe('ConfirmSaveComponent', () => {
  let component: ConfirmSaveComponent;
  let fixture: ComponentFixture<ConfirmSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
