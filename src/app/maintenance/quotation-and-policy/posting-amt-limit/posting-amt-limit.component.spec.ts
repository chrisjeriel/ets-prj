import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingAmtLimitComponent } from './posting-amt-limit.component';

describe('PostingAmtLimitComponent', () => {
  let component: PostingAmtLimitComponent;
  let fixture: ComponentFixture<PostingAmtLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostingAmtLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostingAmtLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
