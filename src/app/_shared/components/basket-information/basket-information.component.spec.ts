import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketInformationComponent } from './basket-information.component';

describe('BasketInformationComponent', () => {
  let component: BasketInformationComponent;
  let fixture: ComponentFixture<BasketInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasketInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
