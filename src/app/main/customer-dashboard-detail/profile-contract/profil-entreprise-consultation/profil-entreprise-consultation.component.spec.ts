import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilEntrepriseConsultationComponent } from './profil-entreprise-consultation.component';

describe('ProfilEntrepriseConsultationComponent', () => {
  let component: ProfilEntrepriseConsultationComponent;
  let fixture: ComponentFixture<ProfilEntrepriseConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilEntrepriseConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilEntrepriseConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
