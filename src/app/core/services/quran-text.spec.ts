import { TestBed } from '@angular/core/testing';

import { QuranText } from './quran-text';

describe('QuranText', () => {
  let service: QuranText;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuranText);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
