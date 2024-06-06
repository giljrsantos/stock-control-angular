import { BehaviorSubject, map, take } from 'rxjs';

import { IGetAllProductsResponse } from '@app/models/interfaces/products/response/i-GetAllProductsResponse';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductsDataTransferService {
  public productsDataEmitter$ =
    new BehaviorSubject<Array<IGetAllProductsResponse> | null>(
      null,
    );
  public productsDatas: Array<IGetAllProductsResponse> = [];

  setProductsData(
    products: Array<IGetAllProductsResponse>,
  ): void {
    if (products) {
      this.productsDataEmitter$.next(products);
      this.getProductsDatas();
    }
  }
  getProductsDatas() {
    this.productsDataEmitter$
      .pipe(
        take(1),
        map((data) =>
          data?.filter((product) => product.amount > 0),
        ),
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.productsDatas = response;
          }
        },
      });
    return this.productsDatas;
  }

  constructor() {}
}
