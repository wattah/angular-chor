/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GoodToKnowComponent } from './good-to-know.component';

describe('GoodToKnowComponent', () => {
  let component: GoodToKnowComponent;
  let fixture: ComponentFixture<GoodToKnowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodToKnowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodToKnowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
