import { ProductsDataTransferService } from '../src/app/shared/services/products/products-data-transfer.service';
import { TestBed } from '@angular/core/testing';

describe('ProductsDataTransferService', () => {
  let service: ProductsDataTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsDataTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
