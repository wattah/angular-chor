import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileContractCreationComponent } from './profile-contract-creation.component';

describe('ProfilleContractCreationComponent', () => {
  let component: ProfileContractCreationComponent;
  let fixture: ComponentFixture<ProfileContractCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileContractCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileContractCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
