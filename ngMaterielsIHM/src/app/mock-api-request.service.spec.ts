import { TestBed } from '@angular/core/testing';

import { MockAPIRequestService } from './mock-api-request.service';

describe('MockAPIRequestService', () => {
  let service: MockAPIRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockAPIRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
