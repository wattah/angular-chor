import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsInformationDetailsComponent } from './contacts-information-details.component';

describe('ContactsInformationDetailsComponent', () => {
  let component: ContactsInformationDetailsComponent;
  let fixture: ComponentFixture<ContactsInformationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsInformationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsInformationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
