import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCompletedAnwserCellRenderComponent } from './task-completed-anwser-cell-render.component';

describe('TaskCompletedAnwserCellRenderComponent', () => {
  let component: TaskCompletedAnwserCellRenderComponent;
  let fixture: ComponentFixture<TaskCompletedAnwserCellRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCompletedAnwserCellRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCompletedAnwserCellRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
