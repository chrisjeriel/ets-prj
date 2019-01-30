import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrOthersComponent } from './or-others.component';

describe('OrOthersComponent', () => {
  let component: OrOthersComponent;
  let fixture: ComponentFixture<OrOthersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrOthersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
