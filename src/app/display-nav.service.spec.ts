import { TestBed } from '@angular/core/testing';

import { DisplayNavService } from '../services/display-nav.service';

describe('DisplayNavService', () => {
  let service: DisplayNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
