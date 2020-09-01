import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QsoaComponent } from './qsoa.component';

describe('QsoaComponent', () => {
  let component: QsoaComponent;
  let fixture: ComponentFixture<QsoaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QsoaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QsoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
