import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDocumentComponent } from './customer-document-component';

describe('ProfilInformationComponent', () => {
  let component: CustomerDocumentComponent;
  let fixture: ComponentFixture<CustomerDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
