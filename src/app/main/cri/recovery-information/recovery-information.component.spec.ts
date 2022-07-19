import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryInformationComponent } from './recovery-information.component';

describe('RecoveryInformationComponent', () => {
  let component: RecoveryInformationComponent;
  let fixture: ComponentFixture<RecoveryInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
