import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkItemListEnterpriseComponent } from './park-item-list-enterprise.component';

describe('ParkItemListEnterpriseComponent', () => {
  let component: ParkItemListEnterpriseComponent;
  let fixture: ComponentFixture<ParkItemListEnterpriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkItemListEnterpriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkItemListEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
