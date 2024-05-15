import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseFormModalComponent } from './expense-form-modal.component';

describe('ExpenseFormModalComponent', () => {
  let component: ExpenseFormModalComponent;
  let fixture: ComponentFixture<ExpenseFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseFormModalComponent]
    });
    fixture = TestBed.createComponent(ExpenseFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
