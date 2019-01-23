import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClmClaimProcessingComponent } from './clm-claim-processing.component';

describe('ClmClaimProcessingComponent', () => {
  let component: ClmClaimProcessingComponent;
  let fixture: ComponentFixture<ClmClaimProcessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClmClaimProcessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClmClaimProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
