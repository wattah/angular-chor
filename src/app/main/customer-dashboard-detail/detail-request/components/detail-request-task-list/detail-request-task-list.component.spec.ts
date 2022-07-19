import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRequestTaskListComponent } from './detail-request-task-list.component';

describe('DetailRequestTaskListComponent', () => {
  let component: DetailRequestTaskListComponent;
  let fixture: ComponentFixture<DetailRequestTaskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRequestTaskListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRequestTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
