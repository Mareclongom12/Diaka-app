import { TestBed } from '@angular/core/testing';

import { Favori } from './favori';

describe('Favori', () => {
  let service: Favori;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Favori);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
