import { TestBed } from '@angular/core/testing';

import { TaskAnwsersHolderService } from './task-anwsers-holder.service';

describe('TaskAnwsersHolderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskAnwsersHolderService = TestBed.get(TaskAnwsersHolderService);
    expect(service).toBeTruthy();
  });
});
