import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionIiTreatyLimitComponent } from './section-ii-treaty-limit.component';

describe('SectionIiTreatyLimitComponent', () => {
  let component: SectionIiTreatyLimitComponent;
  let fixture: ComponentFixture<SectionIiTreatyLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionIiTreatyLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionIiTreatyLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
