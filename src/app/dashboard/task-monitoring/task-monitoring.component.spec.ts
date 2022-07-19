import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMonitoringComponent } from './task-monitoring.component';

describe('TaskMonitoringComponent', () => {
  let component: TaskMonitoringComponent;
  let fixture: ComponentFixture<TaskMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
