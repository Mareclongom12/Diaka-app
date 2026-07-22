import { TestBed } from '@angular/core/testing';

import { Sourate } from './sourate';

describe('Sourate', () => {
  let service: Sourate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sourate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
