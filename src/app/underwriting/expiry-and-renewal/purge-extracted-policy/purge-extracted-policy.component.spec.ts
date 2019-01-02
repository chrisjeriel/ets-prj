import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurgeExtractedPolicyComponent } from './purge-extracted-policy.component';

describe('PurgeExtractedPolicyComponent', () => {
  let component: PurgeExtractedPolicyComponent;
  let fixture: ComponentFixture<PurgeExtractedPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurgeExtractedPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurgeExtractedPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
