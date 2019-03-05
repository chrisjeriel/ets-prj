import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTransactionsComponent } from './module-transactions.component';

describe('ModuleTransactionsComponent', () => {
  let component: ModuleTransactionsComponent;
  let fixture: ComponentFixture<ModuleTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
