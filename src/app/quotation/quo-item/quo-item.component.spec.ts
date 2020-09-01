import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoItemComponent } from './quo-item.component';

describe('QuoItemComponent', () => {
  let component: QuoItemComponent;
  let fixture: ComponentFixture<QuoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
