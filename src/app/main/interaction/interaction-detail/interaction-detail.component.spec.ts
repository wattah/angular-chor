import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionDetailComponent } from './interaction-detail.component';

describe('InteractionDetailComponent', () => {
  let component: InteractionDetailComponent;
  let fixture: ComponentFixture<InteractionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
