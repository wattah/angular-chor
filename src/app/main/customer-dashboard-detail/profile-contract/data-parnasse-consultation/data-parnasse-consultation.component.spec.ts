import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataParnasseConsultationComponent } from './data-parnasse-consultation.component';

describe('DataParnasseConsultationComponent', () => {
  let component: DataParnasseConsultationComponent;
  let fixture: ComponentFixture<DataParnasseConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataParnasseConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataParnasseConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
