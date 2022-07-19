import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMonitoringComponent } from './request-monitoring.component';

describe('RequestMonitoringComponent', () => {
  let component: RequestMonitoringComponent;
  let fixture: ComponentFixture<RequestMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
