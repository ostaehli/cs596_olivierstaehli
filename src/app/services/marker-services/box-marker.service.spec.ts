import { TestBed } from '@angular/core/testing';

import { BoxMarkerService } from './box-marker.service';

describe('BoxMarkerService', () => {
  let service: BoxMarkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoxMarkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
