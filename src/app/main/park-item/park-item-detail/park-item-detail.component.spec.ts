import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkItemDetailComponent } from './park-item-detail.component';

describe('ParkItemDetailComponent', () => {
  let component: ParkItemDetailComponent;
  let fixture: ComponentFixture<ParkItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkItemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
