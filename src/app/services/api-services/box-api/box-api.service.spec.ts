import { TestBed } from '@angular/core/testing';

import { BoxApiService } from './box-api.service';

describe('BoxService', () => {
  let service: BoxApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoxApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
