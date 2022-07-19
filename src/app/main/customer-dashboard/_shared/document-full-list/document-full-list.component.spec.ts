import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentFullListComponent } from './document-full-list.component';

describe('DocumentFullListComponent', () => {
  let component: DocumentFullListComponent;
  let fixture: ComponentFixture<DocumentFullListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentFullListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentFullListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
