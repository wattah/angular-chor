import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsInformationComponent } from './contacts-information.component';

describe('ContactsInformationComponent', () => {
  let component: ContactsInformationComponent;
  let fixture: ComponentFixture<ContactsInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
