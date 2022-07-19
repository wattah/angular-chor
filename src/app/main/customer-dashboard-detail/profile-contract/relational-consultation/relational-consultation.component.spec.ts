import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationalConsultationComponent } from './relational-consultation.component';

describe('RelationalConsultationComponent', () => {
  let component: RelationalConsultationComponent;
  let fixture: ComponentFixture<RelationalConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationalConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationalConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
