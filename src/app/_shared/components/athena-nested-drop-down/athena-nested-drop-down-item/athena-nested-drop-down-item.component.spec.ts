import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthenaNestedDropDownItemComponent } from './athena-nested-drop-down-item.component';

describe('MenuItemComponent', () => {
  let component: AthenaNestedDropDownItemComponent;
  let fixture: ComponentFixture<AthenaNestedDropDownItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthenaNestedDropDownItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthenaNestedDropDownItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
