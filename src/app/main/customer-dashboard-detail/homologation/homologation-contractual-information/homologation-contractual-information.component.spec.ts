import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationContractualInformationComponent } from './homologation-contractual-information.component';

describe('HomologationContractualInformationComponent', () => {
  let component: HomologationContractualInformationComponent;
  let fixture: ComponentFixture<HomologationContractualInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomologationContractualInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomologationContractualInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
