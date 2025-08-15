import { TestBed } from '@angular/core/testing';

import { BirdService } from './bird';

describe('Bird', () => {
  let service: BirdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BirdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
