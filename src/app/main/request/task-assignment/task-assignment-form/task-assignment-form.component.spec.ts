import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentTaskFormComponent } from './task-assignment-form.component';

describe('AssignmentTaskFormComponent', () => {
  let component: AssignmentTaskFormComponent;
  let fixture: ComponentFixture<AssignmentTaskFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentTaskFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentTaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
