import { TestBed } from '@angular/core/testing';

import { Hijri } from './hijri';

describe('Hijri', () => {
  let service: Hijri;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Hijri);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
