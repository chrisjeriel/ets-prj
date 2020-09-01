import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArOthersComponent } from './ar-others.component';

describe('ArOthersComponent', () => {
  let component: ArOthersComponent;
  let fixture: ComponentFixture<ArOthersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArOthersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
