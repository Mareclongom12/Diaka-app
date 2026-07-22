import { TestBed } from '@angular/core/testing';

import { Wudu } from './wudu';

describe('Wudu', () => {
  let service: Wudu;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Wudu);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
