import { TestBed } from '@angular/core/testing';

import { OfflineAudio } from './offline-audio';

describe('OfflineAudio', () => {
  let service: OfflineAudio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineAudio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
