/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WorkflowService } from './workflow.service';

describe('Service: Workflow', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowService]
    });
  });

  it('should ...', inject([WorkflowService], (service: WorkflowService) => {
    expect(service).toBeTruthy();
  }));
});
