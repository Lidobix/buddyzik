import { TestBed } from '@angular/core/testing';

import { DisplayingElementsService } from '../services/displaying-elements.service';

describe('DisplayingElementsService', () => {
  let service: DisplayingElementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayingElementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
