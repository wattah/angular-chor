import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthenaNestedDropDownComponent } from './athena-nested-drop-down.component';

describe('AthenaNestedDropDownComponent', () => {
  let component: AthenaNestedDropDownComponent;
  let fixture: ComponentFixture<AthenaNestedDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthenaNestedDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthenaNestedDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
