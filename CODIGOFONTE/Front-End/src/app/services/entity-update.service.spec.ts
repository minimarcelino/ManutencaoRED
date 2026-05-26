import { TestBed } from '@angular/core/testing';

import { EntityUpdateService } from './entity-update.service';

describe('EntityUpdateService', () => {
  let service: EntityUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
