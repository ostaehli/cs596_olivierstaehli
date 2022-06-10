import { TestBed } from '@angular/core/testing';

import { DetectionMarkerService } from './detection-marker.service';

describe('DetectionMarkerService', () => {
  let service: DetectionMarkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetectionMarkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
