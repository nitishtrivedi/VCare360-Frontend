import { TestBed } from '@angular/core/testing';

import { AcademicyearService } from './academicyear-service';

describe('AcademicyearService', () => {
  let service: AcademicyearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicyearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
