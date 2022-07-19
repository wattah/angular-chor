/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RequestMonitoringDetailCellRendererComponent } from './request-monitoring-detail-cell-renderer.component';

describe('RequestMonitoringDetailCellRendererComponent', () => {
  let component: RequestMonitoringDetailCellRendererComponent;
  let fixture: ComponentFixture<RequestMonitoringDetailCellRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestMonitoringDetailCellRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestMonitoringDetailCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
