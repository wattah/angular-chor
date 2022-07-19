import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabBillingComponent } from './tab-billing.component';

describe('TabBillingComponent', () => {
  let component: TabBillingComponent;
  let fixture: ComponentFixture<TabBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
