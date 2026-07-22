import { TestBed } from '@angular/core/testing';

import { Reciter } from './reciter';

describe('Reciter', () => {
  let service: Reciter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reciter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
