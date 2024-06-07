import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import { ICreateCategoryRequest } from '@app/models/interfaces/categories/request/i-CreateCategoryRequest';
import { IEditCategoryRequest } from '@app/models/interfaces/categories/request/i-EditCategoryRequest';
import { IGetCategoriesResponse } from '@app/models/interfaces/categories/response/i-GetCategoriesResponse';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
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
  ) { }

  createCategory(createRequest: ICreateCategoryRequest) {
    return this.http.post<IGetCategoriesResponse>(
      `${this.API_URL}/category`,
      createRequest,
      this.httpOptions

    )
  }

  editCategoryName(editRequest: IEditCategoryRequest): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/category/edit`,
      { name: editRequest.name },
      {
        ...this.httpOptions,
        params: {
          category_id: editRequest.category_id
        }
      }
    )
  }

  getAllCategories() {
    return this.http.get<IGetCategoriesResponse[]>(
      `${this.API_URL}/categories`,
      this.httpOptions,
    );
  }

  deleteCategory(requestDatas: { category_id: string }) {
    return this.http.delete<void>(
      `${this.API_URL}/category/delete`,
      {
        ...this.httpOptions,
        params: {
          category_id: requestDatas.category_id
        }
      }
    )
  }
}
