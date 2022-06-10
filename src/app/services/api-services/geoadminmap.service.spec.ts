import { TestBed } from '@angular/core/testing';

import { GeoadminmapService } from './geoadminmap.service';

describe('GeoadminmapService', () => {
  let service: GeoadminmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoadminmapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
