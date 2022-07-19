import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkItemFormUpdateComponent } from './park-item-form-update.component';

describe('ParkItemFormUpdateComponent', () => {
  let component: ParkItemFormUpdateComponent;
  let fixture: ComponentFixture<ParkItemFormUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkItemFormUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkItemFormUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
