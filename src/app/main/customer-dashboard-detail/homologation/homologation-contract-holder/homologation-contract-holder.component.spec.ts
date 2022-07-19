import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationContractHolderComponent } from './homologation-contract-holder.component';

describe('HomologationContractHolderComponent', () => {
  let component: HomologationContractHolderComponent;
  let fixture: ComponentFixture<HomologationContractHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomologationContractHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomologationContractHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
