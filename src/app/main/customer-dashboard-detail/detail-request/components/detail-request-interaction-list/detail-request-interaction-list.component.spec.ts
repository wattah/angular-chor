import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRequestInteractionListComponent } from './detail-request-interaction-list.component';

describe('DetailRequestInteractionListComponent', () => {
  let component: DetailRequestInteractionListComponent;
  let fixture: ComponentFixture<DetailRequestInteractionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRequestInteractionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRequestInteractionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
