import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrServiceFeeMunichReComponent } from './or-service-fee-munich-re.component';

describe('OrServiceFeeMunichReComponent', () => {
  let component: OrServiceFeeMunichReComponent;
  let fixture: ComponentFixture<OrServiceFeeMunichReComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrServiceFeeMunichReComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrServiceFeeMunichReComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
