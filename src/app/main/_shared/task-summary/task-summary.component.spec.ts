import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCreationRequestSummaryComponent } from './task-summary.component';

describe('TaskCreationRequestSummaryComponent', () => {
  let component: TaskCreationRequestSummaryComponent;
  let fixture: ComponentFixture<TaskCreationRequestSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCreationRequestSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCreationRequestSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
