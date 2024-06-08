import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { ICreateProductRequest } from '@app/models/interfaces/products/request/i-CreateProductRequest';
import { ICreateProductResponse } from '@app/models/interfaces/products/response/i-CreateProductResponse';
import { IDeleteProductResponse } from '@app/models/interfaces/products/response/i-DeleteProductResponse';
import { IEditProductRequest } from '@app/models/interfaces/products/request/i-EditProductRequest';
import { IGetAllProductsResponse } from '@app/models/interfaces/products/response/i-GetAllProductsResponse';
import { ISaleProductRequest } from '@app/models/interfaces/products/request/i-SaleProductRequest';
import { ISaleProductResponse } from '@app/models/interfaces/products/response/i-SaleProductResponse';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
  ) {}

  getAllProducts() {
    return this.http
      .get<
        IGetAllProductsResponse[]
      >(`${this.API_URL}/products`, this.httpOptions)
      .pipe(
        map((product) =>
          product.filter((data) => data?.amount > 0),
        ),
      );
  }

  createProduct(
    createRequest: ICreateProductRequest,
  ): Observable<ICreateProductResponse> {
    return this.http.post<ICreateProductResponse>(
      `${this.API_URL}/product`,
      createRequest,
      this.httpOptions,
    );
  }

  editProduct(
    editRequest: IEditProductRequest,
  ): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/product/edit`,
      editRequest,
      this.httpOptions,
    );
  }

  deleteProduct(
    product_id: string,
  ): Observable<IDeleteProductResponse> {
    return this.http.delete<IDeleteProductResponse>(
      `${this.API_URL}/product/delete`,
      {
        ...this.httpOptions,
        params: {
          product_id: product_id,
        },
      },
    );
  }

  saleProduct(requestSaleData: ISaleProductRequest) {
    return this.http.put<ISaleProductResponse>(
      `${this.API_URL}/product/sale`,
      {
        amount: requestSaleData.amount,
      },
      {
        ...this.httpOptions,
        params: {
          product_id: requestSaleData.product_id,
        },
      },
    );
  }
}
