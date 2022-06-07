import { TestBed } from '@angular/core/testing';

import { BuddyService } from '../services/buddy.service';

describe('AccountService', () => {
  let service: BuddyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuddyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
