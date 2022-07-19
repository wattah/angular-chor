import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryAlertComponent } from './recovery-alert.component';

describe('RecoveryDateComponent', () => {
  let component: RecoveryAlertComponent;
  let fixture: ComponentFixture<RecoveryAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
