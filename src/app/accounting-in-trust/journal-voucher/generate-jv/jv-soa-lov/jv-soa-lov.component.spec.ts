import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvSoaLovComponent } from './jv-soa-lov.component';

describe('JvSoaLovComponent', () => {
  let component: JvSoaLovComponent;
  let fixture: ComponentFixture<JvSoaLovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvSoaLovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvSoaLovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
