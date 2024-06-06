import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { IDeleteProductAction } from '@app/models/interfaces/products/event/i-DeleteProductAction';
import { IEventAction } from '@app/models/interfaces/products/event/i-EventAction';
import { IGetAllProductsResponse } from '@app/models/interfaces/products/response/i-GetAllProductsResponse';
import { ProductEvent } from '@app/models/enums/products/ProductsEvent';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: [],
})
export class ProductsTableComponent {
  @Input() products: IGetAllProductsResponse[] = [];
  @Output() productEvent = new EventEmitter<IEventAction>();
  @Output() deleteProductEvent =
    new EventEmitter<IDeleteProductAction>();

  public productSelected!: IGetAllProductsResponse;

  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action: string, id?: string): void {
    if (action && action !== '') {
      const productEventData =
        id && id !== '' ? { action, id } : { action };
      this.productEvent.emit(productEventData);
    }
  }

  handleDeleteProduct(
    product_id: string,
    productName: string,
  ): void {
    if (product_id !== '' && productName !== '') {
      this.deleteProductEvent.emit({
        product_id,
        productName,
      });
    }
  }
}
