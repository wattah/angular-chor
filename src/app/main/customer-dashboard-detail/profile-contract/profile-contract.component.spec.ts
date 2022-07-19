import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileContractComponent } from './profile-contract.component';

describe('ProfileContractComponent', () => {
  let component: ProfileContractComponent;
  let fixture: ComponentFixture<ProfileContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
