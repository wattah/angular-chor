import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceMonitoringComponent } from './absence-monitoring.component';

describe('AbsenceMonitoringComponent', () => {
  let component: AbsenceMonitoringComponent;
  let fixture: ComponentFixture<AbsenceMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbsenceMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsenceMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
