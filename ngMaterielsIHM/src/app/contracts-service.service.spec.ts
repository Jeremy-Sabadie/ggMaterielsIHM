import { TestBed } from '@angular/core/testing';

import { ContractsServiceService } from './contracts.service';

describe('ContractsServiceService', () => {
  let service: ContractsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
