import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcvAccEntriesComponent } from './pcv-acc-entries.component';

describe('PcvAccEntriesComponent', () => {
  let component: PcvAccEntriesComponent;
  let fixture: ComponentFixture<PcvAccEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcvAccEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcvAccEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
