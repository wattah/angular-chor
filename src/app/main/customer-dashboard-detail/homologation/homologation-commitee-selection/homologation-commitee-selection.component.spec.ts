import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationCommiteeSelectionComponent } from './homologation-commitee-selection.component';

describe('HomologationCommiteeSelectionComponent', () => {
  let component: HomologationCommiteeSelectionComponent;
  let fixture: ComponentFixture<HomologationCommiteeSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomologationCommiteeSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomologationCommiteeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
