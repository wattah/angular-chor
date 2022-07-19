import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartConfirmationDialogComponent } from './cart-confirmation-dialog.component';

describe('CartConfirmationDialogComponent', () => {
  let component: CartConfirmationDialogComponent;
  let fixture: ComponentFixture<CartConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
