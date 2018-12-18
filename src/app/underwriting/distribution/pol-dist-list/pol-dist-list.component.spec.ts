import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolDistListComponent } from './pol-dist-list.component';

describe('PolDistListComponent', () => {
  let component: PolDistListComponent;
  let fixture: ComponentFixture<PolDistListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolDistListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolDistListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
