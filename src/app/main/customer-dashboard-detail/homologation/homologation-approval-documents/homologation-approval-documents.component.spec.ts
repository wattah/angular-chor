import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomologationApprovalDocumentsComponent } from './homologation-approval-documents.component';

describe('HomologationApprovalDocumentsComponent', () => {
  let component: HomologationApprovalDocumentsComponent;
  let fixture: ComponentFixture<HomologationApprovalDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomologationApprovalDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomologationApprovalDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
