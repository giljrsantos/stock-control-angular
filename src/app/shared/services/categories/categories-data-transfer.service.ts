import { BehaviorSubject, take } from 'rxjs';

import { IGetCategoriesResponse } from '@app/models/interfaces/categories/response/i-GetCategoriesResponse';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesDataTransferService {

  public categoriesDataEmitter$ = new BehaviorSubject<Array<IGetCategoriesResponse> | null>(null,)

  public categoriesDatas: IGetCategoriesResponse[] = [];

  setCategoriaData(
    categories: IGetCategoriesResponse[],
  ): void {
    this.categoriesDataEmitter$.next(categories);
    this.getCategoriesDatas();
  }
  getCategoriesDatas() {
    this.categoriesDataEmitter$.pipe(take(1)).subscribe({
      next: (response) => {
        if (response) {
          this.categoriesDatas = response
        }
      }
    });
    return this.categoriesDatas;
  }
  constructor() { }
}
