import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundDocumentComponent } from './not-found-document.component';

describe('NotFoundDocumentComponent', () => {
  let component: NotFoundDocumentComponent;
  let fixture: ComponentFixture<NotFoundDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotFoundDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
