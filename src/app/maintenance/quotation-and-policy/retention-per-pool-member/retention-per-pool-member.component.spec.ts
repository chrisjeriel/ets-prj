import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionPerPoolMemberComponent } from './retention-per-pool-member.component';

describe('RetentionPerPoolMemberComponent', () => {
  let component: RetentionPerPoolMemberComponent;
  let fixture: ComponentFixture<RetentionPerPoolMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetentionPerPoolMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetentionPerPoolMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
