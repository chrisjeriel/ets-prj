import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelOrComponent } from './cancel-or.component';

describe('CancelOrComponent', () => {
  let component: CancelOrComponent;
  let fixture: ComponentFixture<CancelOrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelOrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelOrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
