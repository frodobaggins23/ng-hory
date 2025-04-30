import { TestBed } from '@angular/core/testing';

import { MountainStateService } from './mountain-state.service';

describe('MountainStateService', () => {
  let service: MountainStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MountainStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
