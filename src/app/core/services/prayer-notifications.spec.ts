import { TestBed } from '@angular/core/testing';

import { PrayerNotifications } from './prayer-notifications';

describe('PrayerNotifications', () => {
  let service: PrayerNotifications;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrayerNotifications);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
