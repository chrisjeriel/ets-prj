import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JvEntryServiceComponent } from './jv-entry-service.component';

describe('JvEntryServiceComponent', () => {
  let component: JvEntryServiceComponent;
  let fixture: ComponentFixture<JvEntryServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JvEntryServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvEntryServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
