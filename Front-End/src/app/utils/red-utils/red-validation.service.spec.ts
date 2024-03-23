import { TestBed } from '@angular/core/testing';

import { RedValidationService } from './red-validation.service';

describe('RedValidationService', () => {
  let service: RedValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
