import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnAttentionComponent } from './mtn-attention.component';

describe('MtnAttentionComponent', () => {
  let component: MtnAttentionComponent;
  let fixture: ComponentFixture<MtnAttentionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtnAttentionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtnAttentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
