import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingTableComponent } from './loading-table.component';

describe('LoadingTableComponent', () => {
  let component: LoadingTableComponent;
  let fixture: ComponentFixture<LoadingTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
