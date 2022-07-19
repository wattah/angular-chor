import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionCompleteHistoryComponent } from './interaction-complete-history.component';

describe('InteractionCompleteHistoryComponent', () => {
  let component: InteractionCompleteHistoryComponent;
  let fixture: ComponentFixture<InteractionCompleteHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionCompleteHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionCompleteHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
