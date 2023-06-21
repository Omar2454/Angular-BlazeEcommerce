import { TestBed } from '@angular/core/testing';

import { BlazeFormServiceService } from './blaze-form-service.service';

describe('BlazeFormServiceService', () => {
  let service: BlazeFormServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlazeFormServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
