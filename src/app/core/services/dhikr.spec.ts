import { TestBed } from '@angular/core/testing';

import { Dhikr } from './dhikr';

describe('Dhikr', () => {
  let service: Dhikr;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dhikr);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
