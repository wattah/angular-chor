import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkItemListParticularComponent } from './park-item-list-particular.component';

describe('ParkItemListParticularComponent', () => {
  let component: ParkItemListParticularComponent;
  let fixture: ComponentFixture<ParkItemListParticularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkItemListParticularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkItemListParticularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
