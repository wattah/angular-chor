import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkItemInternetDetailComponent } from './park-item-internet-detail.component';

describe('ParkItemInternetDetailComponent', () => {
  let component: ParkItemInternetDetailComponent;
  let fixture: ComponentFixture<ParkItemInternetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkItemInternetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkItemInternetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
