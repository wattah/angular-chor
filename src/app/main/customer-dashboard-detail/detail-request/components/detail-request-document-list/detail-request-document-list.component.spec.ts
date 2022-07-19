import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRequestDocumentListComponent } from './detail-request-document-list.component';

describe('DetailRequestDocumentListComponent', () => {
  let component: DetailRequestDocumentListComponent;
  let fixture: ComponentFixture<DetailRequestDocumentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRequestDocumentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRequestDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
