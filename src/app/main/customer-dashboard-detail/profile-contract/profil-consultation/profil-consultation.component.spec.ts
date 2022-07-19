import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilConsultationComponent } from './profil-consultation.component';

describe('ProfilConsultationComponent', () => {
  let component: ProfilConsultationComponent;
  let fixture: ComponentFixture<ProfilConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
