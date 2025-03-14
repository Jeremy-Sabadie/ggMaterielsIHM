import { TestBed } from '@angular/core/testing';

import { APIRequestService } from './api-request.service';

describe('APIRequestService', () => {
  let service: APIRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(APIRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
