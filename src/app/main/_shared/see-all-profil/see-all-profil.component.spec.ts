import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeAllProfilComponent } from './see-all-profil.component';

describe('SeeAllProfilComponent', () => {
  let component: SeeAllProfilComponent;
  let fixture: ComponentFixture<SeeAllProfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeAllProfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeAllProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
