import { TestBed } from '@angular/core/testing';

import { WildlifeDetectionApiService } from './wildlife-detection-api.service';

describe('WildlifeService', () => {
  let service: WildlifeDetectionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WildlifeDetectionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
