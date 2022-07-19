import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartCreationComponent } from './cart-creation.component';

describe('CartCreationComponent', () => {
  let component: CartCreationComponent;
  let fixture: ComponentFixture<CartCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
