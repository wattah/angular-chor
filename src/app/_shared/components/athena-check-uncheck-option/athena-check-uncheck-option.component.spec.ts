/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AthenaCheckUncheckOptionComponent } from './athena-check-uncheck-option.component';

describe('AthenaCheckUncheckOptionComponent', () => {
  let component: AthenaCheckUncheckOptionComponent;
  let fixture: ComponentFixture<AthenaCheckUncheckOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthenaCheckUncheckOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthenaCheckUncheckOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
