import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { CategoryEvent } from '@app/models/enums/categories/CategoriesEvent';
import { IDeleteCategoryAction } from '@app/models/interfaces/categories/event/i-DeleteCategoryAction';
import { IEditCategoryAction } from '@app/models/interfaces/categories/event/i-EditCategoryAction';
import { IGetCategoriesResponse } from '@app/models/interfaces/categories/response/i-GetCategoriesResponse';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: [],
})
export class CategoriesTableComponent {
  @Input() public categories: IGetCategoriesResponse[] = [];
  @Output() public categoryEvent =
    new EventEmitter<IEditCategoryAction>();
  @Output() public deleteCategoryEvent =
    new EventEmitter<IDeleteCategoryAction>();

  public categorySelected!: IGetCategoriesResponse;

  public addCategoryAction =
    CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction =
    CategoryEvent.EDIT_CATEGORY_ACTION;

  handleCategoryEvent(
    action: string,
    id?: string,
    categoryName?: string,
  ): void {
    if (action && action !== '') {
      this.categoryEvent.emit({ action, id, categoryName });
    }
  }

  handleDeleteCategoryEvent(
    category_id: string,
    categoryName: string,
  ): void {
    if (category_id !== '' && categoryName !== '') {
      this.deleteCategoryEvent.emit({
        category_id,
        categoryName,
      });
    }
  }
}
