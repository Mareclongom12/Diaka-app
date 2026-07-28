import { TestBed } from '@angular/core/testing';

import { OfflineBooks } from './offline-books';

describe('OfflineBooks', () => {
  let service: OfflineBooks;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineBooks);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
