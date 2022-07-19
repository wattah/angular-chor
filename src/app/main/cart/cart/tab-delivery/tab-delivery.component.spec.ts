import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDeliveryComponent } from './tab-delivery.component';

describe('TabDeliveryComponent', () => {
  let component: TabDeliveryComponent;
  let fixture: ComponentFixture<TabDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
