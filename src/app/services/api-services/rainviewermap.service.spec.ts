import { TestBed } from '@angular/core/testing';

import { RainviewermapService } from './rainviewermap.service';

describe('RainviewermapService', () => {
  let service: RainviewermapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RainviewermapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
