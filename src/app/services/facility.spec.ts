import { TestBed } from '@angular/core/testing';

import { FacilityService } from './facility';

describe('Facility', () => {
  let service: FacilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
