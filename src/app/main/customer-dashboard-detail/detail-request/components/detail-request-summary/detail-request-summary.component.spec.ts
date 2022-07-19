import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRequestSummaryComponent } from './detail-request-summary.component';

describe('DetailRequestSummaryComponent', () => {
  let component: DetailRequestSummaryComponent;
  let fixture: ComponentFixture<DetailRequestSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRequestSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRequestSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
