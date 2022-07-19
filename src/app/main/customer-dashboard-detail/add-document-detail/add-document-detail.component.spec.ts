import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocumentDetailComponent } from './add-document-detail.component';

describe('AddDocumentDetailComponent', () => {
  let component: AddDocumentDetailComponent;
  let fixture: ComponentFixture<AddDocumentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDocumentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
