import { TestBed } from '@angular/core/testing';

import { AnaliseRedService } from './analise-red.service';

describe('AnaliseRedService', () => {
  let service: AnaliseRedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnaliseRedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
