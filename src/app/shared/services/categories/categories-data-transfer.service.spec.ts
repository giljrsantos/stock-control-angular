import { TestBed } from '@angular/core/testing';

import { CategoriesDataTransferService } from './categories-data-transfer.service';

describe('CategoriesDataTransferService', () => {
  let service: CategoriesDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
