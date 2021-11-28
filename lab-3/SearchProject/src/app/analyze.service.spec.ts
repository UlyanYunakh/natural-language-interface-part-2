import { TestBed } from '@angular/core/testing';

import { AnalyzeService } from './analyze.service';

describe('AnalyzeService', () => {
  let service: AnalyzeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyzeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
