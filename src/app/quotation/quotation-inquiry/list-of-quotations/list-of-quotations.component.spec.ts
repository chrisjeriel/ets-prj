import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfQuotationsComponent } from './list-of-quotations.component';

describe('ListOfQuotationsComponent', () => {
  let component: ListOfQuotationsComponent;
  let fixture: ComponentFixture<ListOfQuotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfQuotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
