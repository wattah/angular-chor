import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilEntrepriseModificationComponent } from './profil-entreprise-modification.component';

describe('ProfilEntrepriseModificationComponent', () => {
  let component: ProfilEntrepriseModificationComponent;
  let fixture: ComponentFixture<ProfilEntrepriseModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilEntrepriseModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilEntrepriseModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
