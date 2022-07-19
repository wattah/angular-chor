/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IconRendererComponent } from './icon-renderer.component';

describe('IconRendererComponent', () => {
  let component: IconRendererComponent;
  let fixture: ComponentFixture<IconRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
