import { TestBed } from '@angular/core/testing';

import { PrayerTimes } from './prayer-times';

describe('PrayerTimes', () => {
  let service: PrayerTimes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrayerTimes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
