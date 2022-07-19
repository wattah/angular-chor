import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationModificationBillComponent } from './creation-modification-bill.component';

describe('CreationModificationBillComponent', () => {
  let component: CreationModificationBillComponent;
  let fixture: ComponentFixture<CreationModificationBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationModificationBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationModificationBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
